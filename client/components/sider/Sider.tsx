import style from "./sider.module.css";
import React, { useState } from "react";
import { Layout, Badge, Menu } from "antd";
import Icon from "@ant-design/icons";
import Link from "next/link";
import { signOut } from "next-auth/react";
// Icons
import profileIcon from "public/assets/icons/user.svg";
import messageIcon from "public/assets/icons/message.svg";
import achivementIcon from "public/assets/icons/achievements.svg";
import gamesIcon from "public/assets/icons/Game.svg";
import newGameIcon from "public/assets/icons/NewGame.svg";
import logoutIcon from "public/assets/icons/out.svg";

const { Sider } = Layout;

const SiderLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={style.container}>
      <Sider
        className={style.sider}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className={style.trigger}>
          <Icon
            component={collapsed ? triggerClose : triggerOpen}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
        <div className={style.siderItems}>
          <Menu
            className={style.menu}
            theme="dark"
            mode="inline"
            items={[
              {
                key: "1",
                icon: (
                  <Icon component={profileIcon} style={{ fontSize: "180%" }} />
                ),
                label: <Link href="/profile/me">Profile</Link>,
              },
              {
                key: "2",
                icon: (
                  <Icon component={messageIcon} style={{ fontSize: "180%" }} />
                ),
                label: <Link href="/message">Messages</Link>,
              },
              {
                key: "3",
                icon: (
                  <Icon component={achivementIcon} style={{ fontSize: "180%" }}/>
                ),
                label: <Link href="/">Achivements</Link>,
              },
              {
                key: "4",
                icon: (
                  <Icon component={gamesIcon} style={{ fontSize: "180%" }} />
                ),
                label: <Link href="/">Current Games</Link>,
              },
              {
                key: "5",
                icon: (
                  <Icon component={newGameIcon} style={{ fontSize: "180%" }} />
                ),
                label: <Link href="/game/newgame">Create Game</Link>,
              },
            ]}
          />
          <Menu
            className={style.menu}
            theme="dark"
            mode="inline"
            items={[
              {
                key: "1",
                icon: (
                  <Icon
                    component={logoutIcon}
                    onClick={() => signOut()}
                    style={{ fontSize: "180%" }}
                  />
                ),
                label: "logout",
              },
            ]}
          />
        </div>
      </Sider>
    </div>
  );
};

export default SiderLayout;

const triggerOpen = () => (
  <svg
    width="3em"
    height="3em"
    viewBox="0 0 30 30"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      opacity="0.3"
      x="5.3335"
      y="6.66602"
      width="13.33"
      height="2.66667"
      rx="1.33333"
      fill="currentColor"
    />
    <rect
      opacity="0.3"
      x="5.3335"
      y="17.334"
      width="13.33"
      height="2.66667"
      rx="1.33333"
      fill="currentColor"
    />
    <path
      d="M6.66683 12C5.93045 12 5.3335 12.597 5.3335 13.3333C5.3335 14.0697 5.93045 14.6667 6.66683 14.6667H25.3302C26.0665 14.6667 26.6635 14.0697 26.6635 13.3333C26.6635 12.597 26.0665 12 25.3302 12H6.66683ZM6.66683 22.666C5.93045 22.666 5.3335 23.263 5.3335 23.9994C5.3335 24.7357 5.93045 25.3327 6.66683 25.3327H25.3302C26.0665 25.3327 26.6635 24.7357 26.6635 23.9994C26.6635 23.263 26.0665 22.666 25.3302 22.666H6.66683Z"
      fill="currentColor"
    />
  </svg>
);

const triggerClose = () => (
  <svg
    width="3em"
    height="3em"
    viewBox="0 0 30 30"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      opacity="0.3"
      x="5.3335"
      y="6.66602"
      width="21.3333"
      height="2.66667"
      rx="1.33333"
      fill="currentColor"
    />
    <rect
      opacity="0.3"
      x="5.3335"
      y="17.334"
      width="21.3333"
      height="2.66667"
      rx="1.33333"
      fill="currentColor"
    />
    <path
      d="M6.66683 12C5.93045 12 5.3335 12.597 5.3335 13.3333C5.3335 14.0697 5.93045 14.6667 6.66683 14.6667H17.3335C18.0699 14.6667 18.6668 14.0697 18.6668 13.3333C18.6668 12.597 18.0699 12 17.3335 12H6.66683ZM6.66683 22.6667C5.93045 22.6667 5.3335 23.2636 5.3335 24C5.3335 24.7364 5.93045 25.3333 6.66683 25.3333H17.3335C18.0699 25.3333 18.6668 24.7364 18.6668 24C18.6668 23.2636 18.0699 22.6667 17.3335 22.6667H6.66683Z"
      fill="currentColor"
    />
  </svg>
);
