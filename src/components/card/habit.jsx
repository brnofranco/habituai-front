import DeleteIcon from "@mui/icons-material/Delete";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import EditIcon from "@mui/icons-material/Edit";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WeekendIcon from "@mui/icons-material/Weekend";
import { Checkbox, IconButton, Menu, MenuItem } from "@mui/material";
import { isToday, parseISO } from "date-fns";
import { useState } from "react";
import { useUpdateHabits } from "../../hooks/useUpdateHabits";
import { useUpdateUser } from "../../hooks/useUpdateUser";

export default function HabitCard({
    id,
    name,
    classification,
    category,
    date,
    conclusionDate = "",
    weekDay,
    setHabitToBeDeleted,
    setHabitIdToBeUpdated,
}) {
    const host = import.meta.env.VITE_PROGRESS_PATH;

    const { description: categoryDescription } = category;

    const { setUserHasUpdate } = useUpdateUser();
    const { setHabitsHasUpdate } = useUpdateHabits();

    const [isLoading, setIsLoading] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleDeleteHabit = () => {
        setHabitToBeDeleted({ id, name });
        handleCloseMenu();
    };

    const handleUpdatedHabit = () => {
        setHabitIdToBeUpdated(id);
        handleCloseMenu();
    };

    const styleMap = () => {
        if (classification === "ruim") return "border-red-600";

        const categories = {
            saude: "border-green-700",
            educacao: "border-purple-900",
            lazer: "border-blue-700",
        };

        return categories[categoryDescription] || "border-gray-800";
    };

    const handleIcon = () => {
        if (classification === "ruim")
            return <DoDisturbAltIcon color={classification} />;

        const categories = {
            saude: <HealthAndSafetyIcon color={categoryDescription} />,
            educacao: <MenuBookIcon color={categoryDescription} />,
            lazer: <WeekendIcon color={categoryDescription} />,
        };

        return categories[categoryDescription] || null;
    };

    const handleCheck = async () => {
        // const data = { id, weekDay, conclusionDate: date };
        // await makeRequestWithAuthorization("POST", host, { data });
    };

    const handleUncheck = async () => {
        // await makeRequestWithAuthorization("DELETE", `${host}/${id}/${date}`);
    };

    const changeCheckbox = async () => {
        setIsLoading(true);
        try {
            if (conclusionDate) {
                await handleUncheck();
            } else {
                await handleCheck();
            }

            setIsLoading(false);
            setUserHasUpdate(true);
            setHabitsHasUpdate(true);
        } catch (error) {
            console.error(`Erro ao alterar checkbox "${name}"`);
        }
    };

    return (
        <div
            className={`w-full rounded-lg p-2 border-2 bg-white shadow-md ${styleMap(
                categoryDescription
            )} `}
        >
            <div className="flex items-center justify-between gap-1">
                <div className="flex items-center">
                    <Checkbox
                        defaultChecked={!!conclusionDate}
                        disabled={!isToday(parseISO(date)) || isLoading}
                        size="medium"
                        onChange={changeCheckbox}
                        color={
                            classification === "ruim"
                                ? classification
                                : categoryDescription
                        }
                    />
                    <span>{name}</span>
                </div>

                <div className="flex items-center">
                    {handleIcon()}

                    <IconButton onClick={handleOpenMenu} size="small">
                        <MoreVertIcon className="text-black" />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem
                            onClick={handleUpdatedHabit}
                            className="flex items-center gap-2"
                        >
                            <EditIcon />
                            Atualizar
                        </MenuItem>
                        <MenuItem
                            onClick={handleDeleteHabit}
                            className="flex items-center gap-2"
                        >
                            <DeleteIcon />
                            Excluir
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
    );
}
