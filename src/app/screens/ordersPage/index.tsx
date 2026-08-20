import { useState, type SyntheticEvent } from "react";
import { Box, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { WaitingOrders } from "./WaitingOrders";
import { ConfirmedOrders } from "./ConfirmedOrders";
import { RejectedOrders } from "./RejectedOrders";
import "../../../css/orders.css";

export function OrdersPage() {
  const [value, setValue] = useState("1");

  function handleChange(_e: SyntheticEvent, newValue: string) {
    setValue(newValue);
  }

  return (
    <div className="orders-page">
      <Box className="orders-layout">
        <Stack className="orders-left">
          <TabContext value={value}>
            <Box className="orders-tabs-frame">
              <Tabs value={value} onChange={handleChange} className="orders-tabs">
                <Tab label="Waiting Confirmation" value="1" />
                <Tab label="Confirmed" value="2" />
                <Tab label="Rejected" value="3" />
              </Tabs>
            </Box>
            <WaitingOrders />
            <ConfirmedOrders />
            <RejectedOrders />
          </TabContext>
        </Stack>

        <Stack className="orders-right">
          <Box className="orders-info-card">
            <Box className="orders-member">
              <Box className="orders-avatar">N</Box>
              <Box>
                <Box className="orders-member-name">Nodira Karimova</Box>
                <Box className="orders-member-sub">Member</Box>
              </Box>
            </Box>
          </Box>

          <Box className="orders-info-card">
            <Box className="orders-info-title">Bank details</Box>
            <Box className="bank-card">
              <Box className="bank-row">
                <span>Bank</span>
                <strong>Xalq Banki</strong>
              </Box>
              <Box className="bank-row">
                <span>Account name</span>
                <strong>K-Glow Secrets</strong>
              </Box>
              <Box className="bank-row">
                <span>Card number</span>
                <strong>8600 **** **** 1234</strong>
              </Box>
            </Box>
            <p className="orders-info-note">
              Transfer here and submit the screenshot when you check out —
              this is just for reference.
            </p>
          </Box>
        </Stack>
      </Box>
    </div>
  );
}
