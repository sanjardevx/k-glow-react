import { useState } from "react";
import { Box } from "@mui/material";
import { useGlobals } from "../../context/useGlobals";
import "../../../css/myPage.css";

export function UserPage() {
  const { authMember } = useGlobals();

  // Name and phone come from the account; address and description are only
  // ever set here, so they start empty rather than pretending to hold data.
  const initialProfile = {
    nick: authMember?.memberNick ?? "",
    phone: authMember?.memberPhone ?? "",
    address: authMember?.memberAddress ?? "",
    desc: authMember?.memberDesc ?? "",
  };

  const [nick, setNick] = useState(initialProfile.nick);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [address, setAddress] = useState(initialProfile.address);
  const [desc, setDesc] = useState(initialProfile.desc);
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setProfile({ nick, phone, address, desc });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="mypage-page">
      <Box className="mypage-body">
        <h2 className="mypage-title">My Page</h2>
        <Box className="mypage-layout">
          <Box className="settings-card mypage-stagger-1">
            <h4>Edit your details</h4>
            <Box className="avatar-upload-row">
              <Box className="avatar-edit-wrap">
                <Box className="avatar-edit">
                  {/* No uploads yet — a plain figure reads as "no photo set"
                      more honestly than an initial pretending to be one. */}
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
                </Box>
                <Box className="avatar-edit-badge">✎</Box>
              </Box>
              <Box className="avatar-upload-copy">
                <strong>Profile photo</strong>
                Optional — you can add one later.
              </Box>
            </Box>

            <Box className="profile-field">
              <label>Nickname</label>
              <input value={nick} onChange={(e) => setNick(e.target.value)} />
            </Box>
            <Box className="profile-row">
              <Box className="profile-field">
                <label>Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Box>
              <Box className="profile-field">
                <label>Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Box>
            </Box>
            <Box className="profile-field">
              <label>Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Box>
            <button type="button" className="profile-save" onClick={handleSave}>
              {saved ? "Saved ✓" : "Save changes"}
            </button>
          </Box>

          <Box className="mypage-stagger-2">
            <Box className="profile-card">
              <Box className="profile-avatar">
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
              </Box>
              <Box className="profile-name">{profile.nick}</Box>
              <Box className="profile-type">User</Box>
              {/* Address and description are blank until the shopper fills them
                  in — a lone pin or empty quotes would just look broken. */}
              {profile.address ? (
                <Box className="profile-address">📍 {profile.address}</Box>
              ) : null}
              {profile.desc ? (
                <>
                  <Box className="profile-divider" />
                  <Box className="profile-desc">"{profile.desc}"</Box>
                </>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
