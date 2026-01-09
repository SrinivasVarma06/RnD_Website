import React, { useState } from "react";
import { ADMIN_LINKS } from "./adminLinks";

export default function AdminPanel({ onLogout }) {
  const [openGroups, setOpenGroups] = useState({});
  
  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    onLogout();
  };

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Admin Dashboard
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ADMIN_LINKS.map((item) => (
          <div
            key={item.label}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {item.label}
            </h3>

            {/* STRAPI */}
            {item.type === "strapi" && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="
                  block text-center
                  bg-purple-100
                  hover:bg-purple-200
                  text-purple-900
                  font-semibold
                  py-2
                  rounded-lg
                  transition
                "
              >
                Open in Strapi
              </a>
            )}

            {/* GOOGLE SHEET */}
            {item.type === "sheet" && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="
                  block text-center
                  bg-green-100
                  hover:bg-green-200
                  text-green-900
                  font-semibold
                  py-2
                  rounded-lg
                  transition
                "
              >
                Open Google Sheet
              </a>
            )}

            {/* EXTERNAL LINK */}
            {item.type === "link" && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="
                  block text-center
                  bg-blue-100
                  hover:bg-blue-200
                  text-blue-900
                  font-semibold
                  py-2
                  rounded-lg
                  transition
                "
              >
                Open in Strapi
              </a>
            )}

            {/* GROUP (LABS) */}
            {item.type === "group" && (
              <>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className="
                    w-full
                    text-left
                    bg-green-100
                    hover:bg-green-200
                    text-green-900
                    font-semibold
                    py-2
                    px-3
                    rounded-lg
                    transition
                    flex
                    justify-between
                    items-center
                  "
                >
                  <span>
                    {openGroups[item.label] ? "Hide" : "Show More"}
                  </span>
                  <span className="text-sm">
                    {openGroups[item.label] ? "▲" : "▼"}
                  </span>
                </button>

                {openGroups[item.label] && (
                  <div className="mt-3 space-y-2">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.url}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          block
                          text-sm
                          bg-green-50
                          hover:bg-green-100
                          text-green-900
                          px-3
                          py-2
                          rounded-md
                          transition
                        "
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
