import { Avatar, Input, Button, List } from "antd";
import { getUserId } from "../../utils/helpers";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatBody = ({ target, messages, setMessage, sendMessage, message }) => {
  const { Item } = List;
  return (
    <div className="mt-4">
      <div className="d-flex mb-3">
        <Avatar
          className="me-3"
          size="large"
          src={target?.avatar ? target.avatar : "/avatar.png"}
        />
        <h3>{target?.name}</h3>
      </div>
      <div
        id="scrollableDiv"
        style={{
          height: "70vh",
          overflow: "auto",
          padding: "0 16px",
        }}
      >
        <InfiniteScroll
          dataLength={messages.length}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={messages}
            renderItem={(item) => (
              <Item>
                <div className="d-flex">
                  <h5
                    className={
                      item.user._id.toString() === getUserId()
                        ? "own-message"
                        : "other-message"
                    }
                  >
                    {item.user.name}:
                  </h5>
                  <h5 className="ms-2">{item.content}</h5>
                </div>
              </Item>
            )}
          />
        </InfiniteScroll>
      </div>

      <div>
        <div className="d-flex mt-3 mb-3">
          <Input.TextArea
            type="text"
            name="message"
            value={message}
            placeholder="Say something"
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
