import type React from "react";
import { Box, Avatar, Typography, Divider, Chip } from "@mui/material";
import { loadCustomerDetail, selectCurrentCustomerDetail, selectCustomerUserId } from "../../CustomerSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";

const UserDetailBox: React.FC = () => {
    const dispatch = useAppDispatch()
    const customerUserId = useAppSelector(selectCustomerUserId)
    const currentCustomerDetail = useAppSelector(selectCurrentCustomerDetail)

    useEffect(() => {
        if(!customerUserId) return
        dispatch(loadCustomerDetail({userIds: [customerUserId]}))
    }, [customerUserId, dispatch])


    return (
        <Box width={250} p={2} bgcolor="#f9f9f9" color="#333">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">用戶資訊</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: "#ffffff", color: "#555", border: "1px solid #ddd" }}>
                    {currentCustomerDetail.name.charAt(0)}
                </Avatar>
                <Typography variant="h6">{currentCustomerDetail.name}</Typography>
                <Typography color="text.secondary">{currentCustomerDetail.email}</Typography>
            </Box>
            <Box mt={2}>
                <Typography variant="subtitle1">標籤</Typography>
                <Chip label={currentCustomerDetail.tags || ""} sx={{ mt: 1 }} />
            </Box>
            <Box mt={2}>
                <Typography variant="subtitle1">備註</Typography>
                <Typography color="text.secondary">{currentCustomerDetail.remark || ""}</Typography>
            </Box>
        </Box>

    );
};

export default UserDetailBox;
