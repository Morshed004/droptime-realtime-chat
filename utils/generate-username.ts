import { nanoid } from "nanoid";

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
  "Dolphin"
];


export default function generateUsername(){
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const username = `nexus-${animal}-${nanoid(5)}`
    return username;
}