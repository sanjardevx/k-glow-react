import { useState } from "react";
import { Box } from "@mui/material";
import "../../../css/myPage.css";

const INITIAL_PROFILE = {
  nick: "nodira.k",
  phone: "+998 90 123 45 67",
  address: "Chilonzor, Tashkent",
  desc: "K-beauty skincare lover, mostly Skincare + a few Makeup picks.",
};

export function UserPage() {
  const [nick, setNick] = useState(INITIAL_PROFILE.nick);
  const [phone, setPhone] = useState(INITIAL_PROFILE.phone);
  const [address, setAddress] = useState(INITIAL_PROFILE.address);
  const [desc, setDesc] = useState(INITIAL_PROFILE.desc);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
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
                <Box className="avatar-edit">{nick.charAt(0).toUpperCase()}</Box>
                <Box className="avatar-edit-badge">✎</Box>
              </Box>
              <Box className="avatar-upload-copy">
                <strong>Profile photo</strong>
                Optional — a letter avatar works fine too.
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
                {profile.nick.charAt(0).toUpperCase()}
              </Box>
              <Box className="profile-name">{profile.nick}</Box>
              <Box className="profile-type">User</Box>
              <Box className="profile-address">📍 {profile.address}</Box>
              <Box className="profile-divider" />
              <Box className="profile-desc">"{profile.desc}"</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
