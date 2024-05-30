import AchievementMural from '../layout/achievementMural';
import BaseModal from '../layout/modal';

interface AchievementMuralProps {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AchievementMuralModal({ openModal, setOpenModal }: Readonly<AchievementMuralProps>) {
    return (
        <BaseModal open={!!openModal} setOpen={setOpenModal}>
            <AchievementMural openAchievementMural={openModal} setOpenAchievementMural={setOpenModal} />
        </BaseModal>
    );
}
