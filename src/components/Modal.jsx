import {Button,Modal,Box} from '@mui/material'

export default function CustomModal({open, handleOpen, buttonText, handleClose, children}){
    return(
        <>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box
                    sx={{
                        display: 'flex',
                        borderRadius: 12,
                        alignItems: 'center',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        marginTop: 10,
                        width: '25%',
                        bgcolor: 'background.paper'
                    }}
                >
                    {children}
                </Box>
            </Modal>
        </>
    )
}