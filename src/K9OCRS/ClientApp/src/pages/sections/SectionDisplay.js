import React from "react";
import Section from "./Section";

export default function SectionDisplay({ list = [] }) {
  return (
    <>
      {list.map((sessions) => (
        <tr>
          <Section key={sessions.section} {...sessions} />
        </tr>
      ))}
    </>
  );
}
