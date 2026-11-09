import { type ChangeEvent, useState } from "react";
import { Box } from "@mui/material";
import { useGlobals } from "../../context/useGlobals";
import MemberService from "../../services/MemberService";
import { serverApi } from "../../../lib/config";
import { useI18n } from "../../../lib/i18n";
import { showError, showSuccess } from "../../../lib/toast";
import { Link } from "react-router-dom";
import {
  ChevronRightIcon,
  HelpIcon,
  LogoutIcon,
  PencilIcon,
  PhoneIcon,
  PinIcon,
  ReceiptIcon,
  SparkleIcon,
} from "../../components/icons";
import { useLogout } from "../../components/headers/useLogout";
import type { MemberUpdateInput } from "../../../lib/types/member";
import { MemberType } from "../../../lib/enums/member.enum";
import { OrderHistory } from "./OrderHistory";
import { AiRoutineCard } from "./AiRoutineCard";
import { BusyLabel } from "../../components/Loaders";
import "../../../css/myPage.css";
import "../../../css/orders.css";

export function UserPage() {
  const { authMember, setAuthMember } = useGlobals();
  const { t } = useI18n();

  // Name and phone come from the account; address and description are only
  // ever set here, so they start empty rather than pretending to hold data.
  const initialProfile = {
    nick: authMember?.memberNick ?? "",
    phone: authMember?.memberPhone ?? "",
    address: authMember?.memberAddress ?? "",
    desc: authMember?.memberDesc ?? "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [nick, setNick] = useState(initialProfile.nick);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [address, setAddress] = useState(initialProfile.address);
  const [desc, setDesc] = useState(initialProfile.desc);
  const [profile, setProfile] = useState(initialProfile);

  // Staged locally until Save actually submits — `imageFile` is what gets
  // uploaded, `imagePreview` is what the two avatars show in the meantime.
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : null,
  );

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      showError(t("error.imageType"));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleEditToggle() {
    if (isEditing) {
      // Cancelling — drop anything typed and go back to the saved values.
      setNick(profile.nick);
      setPhone(profile.phone);
      setAddress(profile.address);
      setDesc(profile.desc);
      setImageFile(null);
      setImagePreview(
        authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : null,
      );
    }
    setIsEditing((prev) => !prev);
  }

  // Uploading a new photo can take a few seconds on mobile; without this the
  // button looked dead, and a second tap sent the same save twice.
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;
    try {
      if (!authMember) throw new Error(t("error.loginFirst"));
      if (!nick || !phone) throw new Error(t("error.fillAll"));

      const input: MemberUpdateInput = {
        memberNick: nick,
        memberPhone: phone,
        memberAddress: address,
        memberDesc: desc,
        memberImage: imageFile ?? undefined,
      };

      setSaving(true);
      const memberService = new MemberService();
      const result = await memberService.updateMember(input);
      setAuthMember(result);

      setProfile({ nick, phone, address, desc });
      setImageFile(null);
      setIsEditing(false);
      showSuccess(t("me.saved"), 700);
    } catch (err) {
      console.log("Error, handleSave:", err);
      showError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mypage-page">
      <Box className="mypage-body">
        <h2 className="mypage-title">{t("me.title")}</h2>
        <Box className="mypage-layout">
          <Box className="mypage-stagger-1">
            {isEditing ? (
              <Box className="settings-card">
                <h4>{t("me.edit")}</h4>
                <Box className="avatar-upload-row">
                  <Box className="avatar-edit-wrap">
                    <Box className="avatar-edit">
                      {imagePreview ? (
                        <img src={imagePreview} alt="" />
                      ) : (
                        // No photo set yet — a plain figure reads as that
                        // more honestly than an initial pretending to be one.
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                    </Box>
                    <label className="avatar-edit-badge" title={t("me.changePhoto")}>
                      <PencilIcon />
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        hidden
                        onChange={handleImageChange}
                      />
                    </label>
                  </Box>
                  <Box className="avatar-upload-copy">
                    <strong>{t("me.photo")}</strong>
                    {t("me.photoOptional")}
                  </Box>
                </Box>

                <Box className="profile-field">
                  <label>{t("me.nickname")}</label>
                  <input
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                  />
                </Box>
                <Box className="profile-row">
                  <Box className="profile-field">
                    <label>{t("me.phone")}</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Box>
                  <Box className="profile-field">
                    <label>{t("me.address")}</label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Box>
                </Box>
                <Box className="profile-field">
                  <label>{t("me.desc")}</label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </Box>
                <Box className="profile-edit-actions">
                  <button
                    type="button"
                    className="profile-edit-toggle ghost"
                    onClick={handleEditToggle}
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="button"
                    className="profile-save"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? <BusyLabel>{t("me.saving")}</BusyLabel> : t("me.save")}
                  </button>
                </Box>
              </Box>
            ) : (
              <>
                <Box className="profile-card">
                  <Box className="profile-avatar">
                    {imagePreview ? (
                      <img src={imagePreview} alt="" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </Box>
                  <Box className="profile-name">{profile.nick}</Box>
                  <Box className="profile-type">
                    {authMember?.memberType === MemberType.ADVISOR
                      ? t("member.advisor")
                      : t("member.member")}
                  </Box>
                  {profile.phone ? (
                    <Box className="profile-address">
                      <PhoneIcon />
                      {profile.phone}
                    </Box>
                  ) : null}
                  {/* Address and description are blank until the shopper
                      fills them in — a lone pin or empty quotes would just
                      look broken. */}
                  {profile.address ? (
                    <Box className="profile-address">
                      <PinIcon />
                      {profile.address}
                    </Box>
                  ) : null}
                  {profile.desc ? (
                    <>
                      <Box className="profile-divider" />
                      <Box className="profile-desc">"{profile.desc}"</Box>
                    </>
                  ) : null}
                </Box>
                <button
                  type="button"
                  className="profile-edit-toggle"
                  onClick={handleEditToggle}
                >
                  {t("me.editProfile")}
                </button>
                <AiRoutineCard />
                <AccountMenuList />
              </>
            )}
          </Box>

          <Box className="mypage-stagger-2">
            <OrderHistory />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

/**
 * Phone only: what the header carries on a desktop — orders, help, AI Beauty
 * and logout — as a list under the profile, the way Coupang's 마이쿠팡 page
 * reads. The bottom tab bar's "My Page" tab is the way in.
 */
function AccountMenuList() {
  const { t } = useI18n();
  const logout = useLogout();

  return (
    <nav className="mypage-menu" aria-label={t("me.menuAria")}>
      <Link to="/orders" className="mypage-menu-item">
        <ReceiptIcon className="mypage-menu-icon" />
        <span>{t("me.orders")}</span>
        <ChevronRightIcon className="mypage-menu-chevron" />
      </Link>
      <Link to="/help" className="mypage-menu-item">
        <HelpIcon className="mypage-menu-icon" />
        <span>{t("nav.help")}</span>
        <ChevronRightIcon className="mypage-menu-chevron" />
      </Link>
      <Link to="/ai-beauty" className="mypage-menu-item">
        <SparkleIcon className="mypage-menu-icon" />
        <span>{t("nav.aiBeauty")}</span>
        <ChevronRightIcon className="mypage-menu-chevron" />
      </Link>
      <button
        type="button"
        className="mypage-menu-item mypage-menu-logout"
        onClick={logout}
      >
        <LogoutIcon className="mypage-menu-icon" />
        <span>{t("account.logout")}</span>
      </button>
    </nav>
  );
}
