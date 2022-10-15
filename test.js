// index.mjs
import { propA, propB, propC, propD } from "./a.mjs";
// a.mjs
const propA = "a";
let propB = () => {
    console.log("b");
};
var propC = "c";
export { propA, propB, propC };
export const propD = "d";
