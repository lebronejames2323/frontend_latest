import { Modal, Box } from '@mui/material';

export default function CustomModal({ open, handleClose, children }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    borderRadius: 5,
                    width: { xs: '90%', sm: '70%', md: '50%', lg: '25%' },
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                }}
            >
                {children}
            </Box>
        </Modal>
    );
}