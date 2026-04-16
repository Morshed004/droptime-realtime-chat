"use client";

import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const ANIMALS: string[] = [
  "Lion",
  "Tiger",
  "Elephant",
  "Giraffe",
  "Zebra",
  "Kangaroo",
  "Panda",
  "Bear",
  "Wolf",
  "Fox",
  "Deer",
  "Monkey",
  "Horse",
  "Cow",
  "Goat",
  "Sheep",
  "Dog",
  "Cat",
  "Rabbit",
  "Dolphin",
];

function generateUsername() {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const username = `nexus-${animal}-${nanoid(5)}`;
  return username;
}

export const useUsername = () => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(process.env.STROAGE_KEY!);

      if (stored) {
        setUsername(stored);
        return;
      }

      const generated = generateUsername();
      localStorage.setItem(process.env.STROAGE_KEY!, username);
      setUsername(generated);
    };
    main()
  }, []);

  return {username}
};
