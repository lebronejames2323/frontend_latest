import { createTheme } from '@mui/material'

const themeOptions = createTheme({
    palette:{
        primary:{
            main: "#000000"
        },
        success:{
            main: "#344CEB"
        },
        secondary:{
            main: "#bdc2c9"
        },
        error:{
            main: "#d42828"
        }
    },
    typography:{
        fontFamily: '"Roboto", sans-serif'
    }
})

export default themeOptions