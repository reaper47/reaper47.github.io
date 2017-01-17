var romanLetters = {
  thousand: "M",
  fiveHundred: "D",
  hundred: "C",
  fifty: "L",
  ten: "X",
  five: "V",
  one: "I"
};

function addOnes(numOnes, romanString) {
  var count = 0;
  while (count < numOnes) {
    romanString += romanLetters.one;
    count += 1;
  }
  return romanString;
}

function convert1s(ones, romanString) {
   /* 
   Add a I or V to every unit below 10.
   
   Possible cases:
        1: I
        2: II
        3: III
        4: IV
        5: V
        6: VI
        7: VII
        8: VIII
        9: IX
   
   Return the whole roman number at the end.
  */
  switch (ones) {
    case 9:
      romanString += romanLetters.one;
      romanString += romanLetters.ten;
      break;
    case 8:
      romanString += romanLetters.five;
      romanString = addOnes(3, romanString);
      break;
    case 7:
      romanString += romanLetters.five;
      romanString = addOnes(2, romanString);
      break;
    case 6:
      romanString += romanLetters.five;
      romanString += romanLetters.one;
      break;
    case 5:
      romanString += romanLetters.five;
      break;
    case 4:
      romanString += romanLetters.one;
      romanString += romanLetters.five;
      break;
    case 3:
      romanString = addOnes(3, romanString);
      break;
    case 2:
      romanString = addOnes(2, romanString);
      break;
    case 1:
      romanString += romanLetters.one;
      break;
  }
  return romanString;
};

function convertToRoman(num, romanString, lowNum, medNum, 
                        highNum, firstRomanNum, secondRomanNum) {
  if (num >= medNum && num < highNum) {
    romanString += firstRomanNum;
    romanString += secondRomanNum;
    num -= medNum;
    
    if (num === 0) {
      return romanString;
    } else {
        num = Math.abs(num);
        return convert(num, romanString);
    }
  } else if (num >= lowNum) {
      while (num >= lowNum) {
        romanString += firstRomanNum;
        num -= lowNum;    
      }
      if (num === 0) {
        return romanString;
      } else {
          return convert(num, romanString);
      } 
  } else {
      return convert(num, romanString);
  }
} 
                        
function convert(num, romanString) {  
  if (typeof romanString === 'undefined') {
    romanString = '';
  }
  
  if (num >= 1000) {
    return convertToRoman(num, romanString, 1000, 9999, 0, romanLetters.thousand, 
                          romanLetters.thousand);
  } else if (num >= 900) {
      return convertToRoman(num, romanString, 500, 900, 1000, romanLetters.hundred,
                            romanLetters.thousand);
  } else if (num >= 500) {
      return convertToRoman(num, romanString, 500, 900, 1000, romanLetters.fiveHundred,
                            romanLetters.thousand);
  } else if (num < 500 && num >= 100) {
      return convertToRoman(num, romanString, 100, 400, 500, romanLetters.hundred, romanLetters.fiveHundred);
  } else if (num >=90 && num < 100) {
      return convertToRoman(num, romanString, 50, 90, 100, romanLetters.ten, 
                            romanLetters.hundred);
  } else if (num >=50 && num < 100) {
      return convertToRoman(num, romanString, 50, 90, 100, romanLetters.fifty, 
                            romanLetters.hundred);
  } else if (num >= 10 && num < 50) {
      return convertToRoman(num, romanString, 10, 40, 50, romanLetters.ten, 
                            romanLetters.fifty);
  } else {
      return convert1s(num, romanString);
  }
}
