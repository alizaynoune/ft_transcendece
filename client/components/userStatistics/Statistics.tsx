import style from "./statistics.module.css";
import Image from "next/image";
import axios from "@/config/axios";
import { Progress, Avatar, Badge, Typography, Upload, Button, Space, Tooltip, message, Modal, Select } from "antd";
import Icon, { EditOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectAuth } from "@/store/reducers/auth";
import { ComponentType, SVGProps, useRef, useContext, useState, useEffect } from "react";
import { ProfileType, RelationshipType, UserType, FriendActions, ProfileContextType } from "@/types/types";
import { ProfileContext } from "context/profileContext";
// Achievements Icons
import {
  MessageIcon,
  PlayGameIcon,
  DeleteUserIcon,
  BlockUserIcon,
  UserIcon,
  EmailIcon,
  AddFriendIcon,
  FriendlyIcon,
  LegendaryIcon,
  PhotogenicIcon,
  SharpshooterIcon,
  WildfireIcon,
  WinnerIcon,
} from "@/icons/index";

const achievementsIcons: {
  [key: string]: ComponentType<SVGProps<SVGSVGElement>>;
} = {
  friendly: FriendlyIcon,
  legendary: LegendaryIcon,
  photogenic: PhotogenicIcon,
  sharpshooter: SharpshooterIcon,
  wildfire: WildfireIcon,
  winner: WinnerIcon,
};
interface Props {
  data: ProfileType & UserType & RelationshipType;
  refresh: () => Promise<unknown>;
}
const { Text, Title } = Typography;
const { Option } = Select;

const actionsList: { [key: string]: { icon: JSX.Element; tooltip: string; action: string }[] } = {
  friend: [
    { icon: <Icon component={MessageIcon} />, tooltip: "Send message", action: "message" },
    { icon: <Icon component={PlayGameIcon} />, tooltip: "Invite to play game", action: "game/invite" },
    { icon: <Icon component={DeleteUserIcon} />, tooltip: "unfriend", action: "friends/unfriend" },
    { icon: <Icon component={BlockUserIcon} />, tooltip: "Block", action: "friends/blockfriend" },
  ],
  inviteSender: [
    { icon: <Icon component={PlayGameIcon} />, tooltip: "Invite to play game", action: "game/invite" },
    { icon: <CloseOutlined />, tooltip: "Reject friend request", action: "friends/rejectrequest" },
    { icon: <CheckOutlined />, tooltip: "Accept friend request", action: "friends/acceptrequest" },
    { icon: <Icon component={BlockUserIcon} />, tooltip: "Block", action: "friends/blockfriend" },
  ],
  inviteReceiver: [
    { icon: <Icon component={PlayGameIcon} />, tooltip: "Invite to play game", action: "game/invite" },
    { icon: <Icon component={BlockUserIcon} />, tooltip: "Block", action: "friends/blockfriend" },
  ],
  other: [
    { icon: <Icon component={PlayGameIcon} />, tooltip: "Invite to play game", action: "game/invite" },
    { icon: <Icon component={AddFriendIcon} />, tooltip: "Send friend request", action: "friends/sendrequest" },
    { icon: <Icon component={BlockUserIcon} />, tooltip: "Block", action: "friends/blockfriend" },
  ],
};

const Statistics: React.FC<Props> = ({ data, refresh }) => {
  const { lastMatches, isMyProfile } = useContext(ProfileContext) as ProfileContextType;
  const [matches, setMatches] = useState({ total: 0, winner: 0 });
  const level = 0.3 * Math.sqrt(data.xp) || 0;
  const { intra_id } = useAppSelector(selectAuth);
  const progress = ((level - Math.floor(level)) / 1) * 100;
  const WinRatio = Number(((matches.winner / matches.total) * 100).toFixed(2)) || 0;
  const lazyRoot = useRef(null);
  const [gameLevel, setGameLevel] = useState<"EASY" | "NORMAL" | "DIFFICULT">("NORMAL");
  const actionIndex = data.relationship
    ? data.relationship.isFriend
      ? "friend"
      : data.relationship.senderid === intra_id
      ? "inviteReceiver"
      : "inviteSender"
    : "other";

  const gameLevelOptions = () => {
    return (
      <>
        <Text strong>{"Please select game level"}</Text>
        <Select
          className={style.selectLevel}
          showSearch={false}
          placeholder="Select level of game"
          onChange={(value) => {
            setGameLevel(value);
          }}
          size="large"
          defaultValue={gameLevel}
        >
          <Option value={"EASY"}>{" Easir "}</Option>
          <Option value={"NORMAL"}>{"Normal"}</Option>
          <Option value={"DIFFICULT"}>{"Difficult"}</Option>
        </Select>
      </>
    );
  };

  const actions: FriendActions = (user, action) => {
    return new Promise(async (resolve, reject) => {
      try {
        const body = action.split("/")[0] === "game" ? { userId: user.intra_id } : { id: user.intra_id.toString() };
        if (action.split("/")[0] !== "game") {
          const res = await axios.post(action, { id: user.intra_id.toString() });
          return resolve(res.data);
        } else {
          Modal.confirm({
            title: gameLevelOptions(),
            content: <Text type="secondary">{`you will send game invitation to ${user.username}`}</Text>,
            okText: "send",
            async onOk() {
              try {
                const res = await axios.post("game/invite", { userId: user.intra_id, gameLevel });
                message.success(res.data.message);
              } catch (error) {
                error instanceof Error && message.error(error.message);
              }
            },
          });
        }
      } catch (error) {
        return reject(error);
      }
    });
  };

  useEffect(() => {
    setMatches({
      total: lastMatches.length,
      winner: lastMatches.filter((m) => m.players[0].score > m.players[1].score).length,
    });
  }, [lastMatches]);

  return (
    <div className={style.container}>
      <div className={style.progressContainer} ref={lazyRoot}>
        <Image
          className={style.progressImage}
          lazyRoot={lazyRoot}
          loader={() => data.img_url || "/images/defaultProfileAvatar.jpg"}
          src="/images/defaultProfileAvatar.jpg"
          objectFit="cover"
          layout="fill"
          priority
        />
        <Progress
          className={style.progress}
          type="dashboard"
          gapDegree={1}
          percent={progress}
          status="normal"
          width={200}
          format={() => level.toFixed(2)}
          trailColor="rgba(0, 0, 0, 0.2)"
        />
        {isMyProfile && (
          <Upload>
            <Button
              icon={<EditOutlined size={1} />}
              shape="circle"
              size="large"
              style={{
                position: "absolute",
                bottom: "20%",
                right: "20%",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                color: "var(--light-color)",
              }}
            />
          </Upload>
        )}
      </div>
      {data.users_achievements.length > 0 && (
        <div className={style.achievements}>
          <Avatar.Group
            className={style.avatarGroup}
            maxCount={4}
            size={80}
            maxPopoverTrigger="click"
            maxPopoverPlacement="bottom"
            maxStyle={{
              color: "#FFFFFF",
              border: "2px solid #FFFFFF",
              backgroundColor: "#3699FF",
              cursor: "pointer",
              marginLeft: "-40px",
            }}
          >
            {data.users_achievements.map((a, key) => {
              return (
                <Avatar
                  key={key}
                  icon={<Icon component={achievementsIcons[a.achievements.name]} />}
                  className={`${style[a.achievements.level.toLowerCase()]} ${style.avatar}`}
                />
              );
            })}
          </Avatar.Group>
        </div>
      )}
      <div className={style.gameRatioContainer}>
        {isMyProfile ? (
          <>
            <Progress
              success={{ percent: WinRatio, strokeColor: "var(--success-color)" }}
              type="dashboard"
              gapDegree={180}
              status="normal"
              width={200}
              trailColor="var(--error-color)"
              format={() => <Title level={4} type="secondary" italic>{`Win Ratio ${WinRatio}%`}</Title>}
              style={{ height: "120px" }}
            />
            <Badge
              className={style.badge}
              status="default"
              color={"var(--success-color)"}
              text={<Text type="success" italic>{`Wins ${matches.winner}`}</Text>}
            />
            <Badge
              className={style.badge}
              status="error"
              text={
                <Text type="danger" italic>
                  {`Loses ${matches.total - matches.winner}`}
                </Text>
              }
              size="default"
            />
          </>
        ) : (
          <Space direction="vertical">
            <Space>
              {actionsList[actionIndex].map((i, key) => (
                <Tooltip key={key} title={i.tooltip}>
                  <Button
                    type="primary"
                    size="large"
                    icon={i.icon}
                    onClick={async () => {
                      try {
                        const res = await actions(data, i.action);
                        message.success(res.message);
                        refresh();
                      } catch (error) {
                        error instanceof Error && message.error(error.message);
                        console.log(error);
                      }
                    }}
                  />
                </Tooltip>
              ))}
            </Space>
            <Text strong italic>
              <Icon component={UserIcon} style={{ fontSize: 17 }} /> {` ${data.username}`}
            </Text>
            <Text strong italic>
              <Icon component={EmailIcon} style={{ fontSize: 17 }} />
              {` ${data.email}`}
            </Text>
          </Space>
        )}
      </div>
    </div>
  );
};

export default Statistics;
