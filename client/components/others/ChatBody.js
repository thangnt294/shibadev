import { useEffect, useRef } from "react";
import { Avatar, Input, Button, List } from "antd";
import { getUserId } from "../../utils/helpers";
import moment from "moment";
import { MessageOutlined } from "@ant-design/icons";

const ChatBody = ({ target, messages, setMessage, sendMessage, message }) => {
  const { Item } = List;

  const scrollRef = useRef();

  const scrollToMyRef = () => {
    const scroll =
      scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    scrollRef.current.scrollTo(0, scroll);
  };

  useEffect(() => {
    scrollToMyRef();
  }, [messages]);

  const formatChatTime = (time) => {
    const now = moment();
    const difference = now.diff(moment(time).startOf("day"), "days");
    if (difference < 1) {
      return moment(time).format("HH:mm");
    }

    if (difference < 2) {
      return `Yesterday ${moment(time).format("HH:mm")}`;
    }

    return moment(time).format("DD/MM HH:mm");
  };

  return (
    <div className="mt-4">
      <div className="d-flex mb-3">
        <Avatar
          className="me-3 ms-3"
          size="large"
          src={target?.avatar ? target.avatar : "/avatar.png"}
        />
        <h3>{target?.name}</h3>
      </div>
      <div
        ref={scrollRef}
        id="scrollableDiv"
        style={{
          height: "70vh",
          overflow: "auto",
        }}
        className="msger-chat"
      >
        {messages?.length > 0 ? (
          <List
            dataSource={messages}
            split={false}
            renderItem={(item) => (
              <Item className="chat-item">
                <div
                  className={`msg ${
                    item.user._id.toString() === getUserId()
                      ? "right-msg"
                      : "left-msg"
                  }`}
                >
                  <Avatar
                    className="msg-img"
                    src={item.user.avatar ? item.user.avatar : "/avatar.png"}
                  />

                  <div className="msg-bubble">
                    <div className="msg-info mb-2">
                      <div className="msg-info-name me-4">{item.user.name}</div>
                      <div className="msg-info-time">
                        {formatChatTime(item.createdAt)}
                      </div>
                    </div>

                    <div className="msg-text">{item.content}</div>
                  </div>
                </div>
              </Item>
            )}
          />
        ) : (
          <div className="d-flex justify-content-center p-5">
            <div className="text-center p-5 d-flex">
              <p className="lead text-muted">No messages yet</p>
              <MessageOutlined className="text-muted lead ms-2 mt-1" />
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="d-flex mt-3 mb-3">
          <Input.TextArea
            type="text"
            name="message"
            value={message}
            placeholder="Say something..."
            onChange={(e) => setMessage(e.target.value)}
            className="me-3"
            onPressEnter={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          />
          <div>
            <Button
              size="large"
              style={{ height: "100%" }}
              type="primary"
              onClick={sendMessage}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
