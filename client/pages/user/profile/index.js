import { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "antd";
import UserProfileForm from "../../../components/forms/UserProfileForm";

const user = {
  name: "Thomas",
  email: "thomas@example.com",
  avatar: "/avatar.png",
  role: ["Subscriber", "Instructor", "Admin"],
  balance: 9.99,
  bio: "I'm just a normal developer",
  title: "Full Stack Developer | Cloud Engineer",
  address: "Thomas's house, Hanoi, Vietnam",
};

const UserProfile = () => {
  return (
    <div class="container mt-5">
      <div class="main-body">
        <div class="row gutters-sm">
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-column align-items-center text-center">
                  <Image src="/avatar.png" alt="Avatar" preview={false} />
                  <div class="mt-3">
                    <h4>{user.name}</h4>
                    <p class="text-secondary mb-1">{user.title}</p>
                    <p class="text-muted font-size-sm">{user.address}</p>
                    <button class="btn btn-primary">Follow</button>
                    <button class="btn btn-outline-primary">Message</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div class="card mb-3">
              <div class="card-body">
                <UserProfileForm user={user} />
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
