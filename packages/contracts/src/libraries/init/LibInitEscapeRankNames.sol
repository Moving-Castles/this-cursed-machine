// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { EscapeRankName } from "../../codegen/index.sol";

library LibInitEscapeRankNames {
  function init() internal {
    // These represent the names of 25 grid cells, which determine the coolness of an escaped stump NFT
    // The first key is completed orders rank, higher is better, 5 in total
    // The second key is points spent rank, higher is better, 5 in total

    // TODO replace name placeholders
    EscapeRankName.set(0, 0, "few orders, few points");
    EscapeRankName.set(0, 1, "0_1");
    EscapeRankName.set(0, 2, "0_2");
    EscapeRankName.set(0, 3, "0_3");
    EscapeRankName.set(0, 4, "few orders, many points");

    EscapeRankName.set(1, 0, "1_0");
    EscapeRankName.set(1, 1, "1_1");
    EscapeRankName.set(1, 2, "1_2");
    EscapeRankName.set(1, 3, "1_3");
    EscapeRankName.set(1, 4, "1_4");

    EscapeRankName.set(2, 0, "2_0");
    EscapeRankName.set(2, 1, "2_1");
    EscapeRankName.set(2, 2, "2_2");
    EscapeRankName.set(2, 3, "2_3");
    EscapeRankName.set(2, 4, "2_4");

    EscapeRankName.set(3, 0, "3_0");
    EscapeRankName.set(3, 1, "3_1");
    EscapeRankName.set(3, 2, "3_2");
    EscapeRankName.set(3, 3, "3_3");
    EscapeRankName.set(3, 4, "3_4");

    EscapeRankName.set(4, 0, "many orders, few points");
    EscapeRankName.set(4, 1, "4_1");
    EscapeRankName.set(4, 2, "4_2");
    EscapeRankName.set(4, 3, "4_3");
    EscapeRankName.set(4, 4, "many orders, many points");
  }
}
