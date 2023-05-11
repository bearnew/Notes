var s = "ADOBECODEBANC";
var t = "ABC";

console.log(minWindow(s, t));

function minWindow(s, t) {
    var winFreq = {};
    var tFreq = {};
    var left = 0;
    var right = 0;
    var begin = 0;
    var minLen = s.length + 1;
    var distance = 0;

    for (var str of t) {
        if (!tFreq[str]) {
            tFreq[str] = 1;
        } else {
            tFreq[str] += 1;
        }
        winFreq[str] = 0;
    }

    while (right < s.length) {
        if (tFreq[s[right]] === 0) {
            right++;
        } else {
            if (winFreq[s[right]] < tFreq[s[right]]) {
                distance++;
            }
            winFreq[s[right]]++;
            right++;
            while (distance === t.length) {
                if (right === t.length) {
                    if (right - left < minLen) {
                        minLen = right - left;
                        begin = left;
                    }
                    if (winFreq[s[left]] === 0) {
                        left++;
                    } else {
                        if (winFreq[s[left]] === tFreq[s[left]]) {
                            distance--;
                        }
                        winFreq[s[left]]--;
                        left++;
                    }
                }
            }
        }
    }

    if (minLen > s.length) {
        return "";
    } else {
        return s.slice(begin, begin + minLen);
    }
}
