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
import { useI18n } from "../../../lib/i18n";
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
  const { t } = useI18n();

  /** Slice: Data => Store **/
  const { setWaitingOrders, setConfirmedOrders, setRejectedOrders } =
    actionDispatch(useAppDispatch());
  // Each tab shows placeholders until its own request settles, instead of
  // "no orders" before the orders have had a chance to arrive.
  const [loading, setLoading] = useState({
    waiting: true,
    confirmed: true,
    rejected: true,
  });
  const settled = (key: keyof typeof loading) => () =>
    setLoading((prev) => ({ ...prev, [key]: false }));
  // A guest never sends the requests, so there is nothing to wait for.
  const isLoading = (key: keyof typeof loading) =>
    Boolean(authMember) && loading[key];

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
      .catch((err) => console.log(err))
      .finally(settled("waiting"));

    orderService
      .getMyOrders({ ...page, orderStatus: OrderStatus.CONFIRMED })
      .then((data) => setConfirmedOrders(data))
      .catch((err) => console.log(err))
      .finally(settled("confirmed"));

    orderService
      .getMyOrders({ ...page, orderStatus: OrderStatus.REJECTED })
      .then((data) => setRejectedOrders(data))
      .catch((err) => console.log(err))
      .finally(settled("rejected"));
  }, [authMember]);

  function handleChange(_e: SyntheticEvent, newValue: string) {
    setValue(newValue);
  }

  return (
    <div className="orders-page">
      <Box className="orders-layout">
        <h1 className="orders-title">{t("orders.title")}</h1>
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
                <Tab label={t("status.waiting")} value="1" />
                <Tab label={t("status.confirmed")} value="2" />
                <Tab label={t("status.rejected")} value="3" />
              </Tabs>
            </Box>
            <WaitingOrders loading={isLoading("waiting")} />
            <ConfirmedOrders loading={isLoading("confirmed")} />
            <RejectedOrders loading={isLoading("rejected")} />
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
                    ? t("member.advisor")
                    : t("member.member")}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="orders-info-card">
            <Box className="orders-info-title">{t("orders.bankTitle")}</Box>
            <BankDetailsCard />
            <p className="orders-info-note">{t("orders.bankNote")}</p>
          </Box>
        </Stack>
      </Box>
    </div>
  );
}
