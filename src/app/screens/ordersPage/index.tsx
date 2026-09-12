import { useEffect, useState, type SyntheticEvent } from "react";
import { Box, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { BankDetailsCard } from "../../components/BankDetailsCard";
import { WaitingOrders } from "./WaitingOrders";
import { ConfirmedOrders } from "./ConfirmedOrders";
import { RejectedOrders } from "./RejectedOrders";
import { useAppDispatch } from "../../hooks";
import {
  setConfirmedOrders,
  setRejectedOrders,
  setWaitingOrders,
} from "./slice";
import { useGlobals } from "../../context/useGlobals";
import OrderService from "../../services/OrderService";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { MemberType } from "../../../lib/enums/member.enum";
import type { AppDispatch } from "../../store";
import type { Order } from "../../../lib/types/order";
import "../../../css/orders.css";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: AppDispatch) => ({
  setWaitingOrders: (data: Order[]) => dispatch(setWaitingOrders(data)),
  setConfirmedOrders: (data: Order[]) => dispatch(setConfirmedOrders(data)),
  setRejectedOrders: (data: Order[]) => dispatch(setRejectedOrders(data)),
});

const PAGE_SIZE = 20;

export function OrdersPage() {
  const [value, setValue] = useState("1");
  const { authMember } = useGlobals();

  /** Slice: Data => Store **/
  const { setWaitingOrders, setConfirmedOrders, setRejectedOrders } =
    actionDispatch(useAppDispatch());

  useEffect(() => {
    // `/order/all` is behind auth — asking as a guest just earns a 401.
    if (!authMember) return;

    // One request per tab: the endpoint filters by a single status, and all
    // three are fetched up front so switching tabs is instant.
    const orderService = new OrderService();
    const page = { page: 1, limit: PAGE_SIZE };

    orderService
      .getMyOrders({ ...page, orderStatus: OrderStatus.WAITING_CONFIRMATION })
      .then((data) => setWaitingOrders(data))
      .catch((err) => console.log(err));

    orderService
      .getMyOrders({ ...page, orderStatus: OrderStatus.CONFIRMED })
      .then((data) => setConfirmedOrders(data))
      .catch((err) => console.log(err));

    orderService
      .getMyOrders({ ...page, orderStatus: OrderStatus.REJECTED })
      .then((data) => setRejectedOrders(data))
      .catch((err) => console.log(err));
  }, [authMember]);

  function handleChange(_e: SyntheticEvent, newValue: string) {
    setValue(newValue);
  }

  return (
    <div className="orders-page">
      <Box className="orders-layout">
        <h1 className="orders-title">My Orders</h1>
        <Stack className="orders-left">
          <TabContext value={value}>
            <Box className="orders-tabs-frame">
              {/* "Waiting Confirmation" alone doesn't fit next to the other
                  two labels under ~390px — scrollable + no arrow buttons
                  means it swipes like the category chip row instead of
                  silently clipping the last tab off-screen. */}
              <Tabs
                value={value}
                onChange={handleChange}
                className="orders-tabs"
                variant="scrollable"
                scrollButtons={false}
              >
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
              <Box className="orders-avatar">
                {(authMember?.memberNick ?? "?").charAt(0).toUpperCase()}
              </Box>
              <Box>
                <Box className="orders-member-name">
                  {authMember?.memberNick}
                </Box>
                <Box className="orders-member-sub">
                  {authMember?.memberType === MemberType.ADVISOR
                    ? "Advisor"
                    : "Member"}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="orders-info-card">
            <Box className="orders-info-title">Bank details</Box>
            <BankDetailsCard />
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
