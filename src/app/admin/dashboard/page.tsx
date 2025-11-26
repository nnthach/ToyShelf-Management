import React from "react";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        text
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">text</div>
      <div className="bg-primary-foreground p-4 rounded-lg">text</div>
      <div className="bg-primary-foreground p-4 rounded-lg">text</div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        text
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">text</div>
    </div>
  );
}
