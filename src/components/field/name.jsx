import { TextField } from "@mui/material";

export default function NameField(props) {
    return (
        <TextField
            id="name"
            label="Nome/Apelido"
            variant="outlined"
            {...props}
        />
    );
}

export const nameYupValidations = () => {
    return {
        name: Yup.string()
            .min(2, "Nome inválido")
            .max(15, "Nome inválido")
            .required("Campo obrigatório")
            .trim("Nome inválido"),
    };
};
