import style from "./settingMessenger.module.css";
import { Avatar, Button, Card, Space, Typography, Popover } from "antd";

import { ConversationsType } from "@/types/types";
import { ReactNode, useEffect } from "react";
import Icon from "@ant-design/icons";

import {
  Settings2Icon,
  UserIcon,
  PlayGameIcon,
  LevelIcon,
  TrashIcon,
  BlockUserIcon,
  SpeakerIcon,
  MuteIcon,
  SettingIcon,
} from "@/icons/index";
import type { UserType } from "@/types/types";
type PropsType = {
  conversation: ConversationsType;
};

const CardGridStyle: React.CSSProperties = {
  width: "100%",
  cursor: "pointer",
  color: "var(--secondary-color)",
};

const CardGrid = (
  item: { lable: string; icon: any; hoverable: boolean },
  key: number,
  id: string
) => {
  return (
    <Card.Grid
      style={CardGridStyle}
      key={key}
      hoverable={item.hoverable}
      onClick={(e) => {
        console.log(item.lable, id);
      }}
    >
      <Space>
        <Icon component={item.icon} style={{ fontSize: "130%" }} />
        <Typography.Text>{item.lable}</Typography.Text>
      </Space>
    </Card.Grid>
  );
};

const CardSettingText = [
  {
    lable: "Level 42",
    icon: LevelIcon,
    hoverable: false,
  },
  {
    lable: "View profile",
    icon: UserIcon,
    hoverable: true,
  },
  {
    lable: "Invet to play a game",
    icon: PlayGameIcon,
    hoverable: true,
  },

  {
    lable: "Delete conversation",
    icon: TrashIcon,
    hoverable: true,
  },
  {
    lable: "Block",
    icon: BlockUserIcon,
    hoverable: true,
  },
  {
    lable: "Mute",
    icon: SpeakerIcon,
    hoverable: true,
  },
];

const getCardGridItem = (id: string) => {
  return CardSettingText.map((i, key) => CardGrid(i, key, id));
};

/**
 * @param id string
 * @description handel click member's group chat
 */
const handelClick = (id: string) => {
  console.log(id);
};

const CardMembers = (members: UserType[]) => {
  return members.map((m, key) => (
    <Popover
      key={key}
      content={getCardGridItem(m.id)}
      title={
        <Space>
          <Avatar src={m.avatar} size="large" />
          <Space direction="vertical">
            <Typography.Text>{m.name.username}</Typography.Text>
            <Typography.Text type="secondary">{m.email}</Typography.Text>
          </Space>
        </Space>
      }
      trigger="click"
      onVisibleChange={(e) => {
        console.log(e);
      }}
    >
      <Card.Grid style={CardGridStyle} onClick={(e) => handelClick(m.id)}>
        <Space>
          <Avatar src={m.avatar} size="large" />
          <Space direction="vertical">
            <Typography.Text>{m.name.username}</Typography.Text>
            <Typography.Text type="secondary">{m.email}</Typography.Text>
          </Space>
        </Space>
      </Card.Grid>
    </Popover>
  ));
};

const SettingMessenger: React.FC<PropsType> = ({ conversation }) => {
  useEffect(() => {
    //console.log(conversation.id);
  }, [conversation]);

  return (
    <div className={style.container}>
      {conversation.type !== "group" && (
        <Avatar
          style={{
            marginBottom: "-35px",
            zIndex: 2,
          }}
          src={conversation.members[1].avatar}
          size={70}
        />
      )}
      <Card
        className={style.card}
        title={
          <Space>
            {conversation.type === "group" && (
              <Avatar src={conversation.members[0].avatar} size="large" />
            )}
            <Space
              direction="vertical"
              align={conversation.type === "group" ? "start" : "center"}
            >
              {conversation.type === "group" ? (
                <Space>
                  <Typography.Text strong>
                    {conversation.members[1].name.username}
                  </Typography.Text>
                  <Typography.Text type="success">{"admin"}</Typography.Text>
                </Space>
              ) : (
                <Typography.Text strong>
                  {" "}
                  {conversation.members[1].name.username}
                </Typography.Text>
              )}

              <Typography.Text type="secondary">
                {conversation.members[1].email}
              </Typography.Text>
            </Space>
          </Space>
        }
        extra={
          conversation.type === "group" ? (
            <Button type="link" icon={<Icon component={Settings2Icon} />} />
          ) : null
        }
      >
        {conversation.type === "group"
          ? CardMembers(conversation.members)
          : getCardGridItem(conversation.members[1].id)}
      </Card>
    </div>
  );
};

export default SettingMessenger;
