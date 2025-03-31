import React from "react";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRange } from "@mui/icons-material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";


const MuiDatePicker: React.FC = () => {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs(new Date().toLocaleDateString()));

    const [pickerOpen, setPickerOpen] = useState(false);

    return (
        <>
            <IconButton sx={{ color: "white" }} onClick={() => setPickerOpen(true)}>
                <DateRange />
            </IconButton>

            {pickerOpen && (
                <Paper elevation={3} sx={{ position: 'absolute', top: 50, right: 200, zIndex: 10 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <Button variant="contained" sx={{ margin: 1, float: "right" }} onClick={() => setPickerOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" sx={{ margin: 1, float: "right" }} onClick={() => setPickerOpen(false)}>
                        OK
                    </Button>
                </Paper>
            )}
        </>
    );
}
export default MuiDatePicker;