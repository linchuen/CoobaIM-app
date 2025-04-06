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
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loadChats, loadPastChats, selectCurrentRoomId } from "../ChatPageSlice";
import { selectTokenInfo } from "../../globalSlice";


const MuiDatePicker: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [date, setDate] = React.useState<Dayjs>(dayjs(new Date().toLocaleDateString()));

    const [pickerOpen, setPickerOpen] = useState(false);
    const submit = () => {
        if (!tokenInfo || currentRoomId === 0) return

        const isBeforToday = date.isBefore(dayjs(), 'day')
        if (isBeforToday) {
            dispatch(loadPastChats({ roomId: currentRoomId, date: date.format("YYYY-MM-DD") }))
        } else {
            dispatch(loadChats({ roomId: currentRoomId }))
        }
        setPickerOpen(false)
    }
    return (
        <>
            <IconButton sx={{ color: "white" }} onClick={() => setPickerOpen(true)}>
                <DateRange />
            </IconButton>

            {pickerOpen && (
                <Paper elevation={3} sx={{ position: 'absolute', top: 50, right: 200, zIndex: 10 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={date}
                            onChange={(newValue) => {
                                setDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <Button variant="contained" sx={{ margin: 1, float: "right" }} onClick={() => setPickerOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" sx={{ margin: 1, float: "right" }} onClick={submit}>
                        OK
                    </Button>
                </Paper>
            )}
        </>
    );
}
export default MuiDatePicker;