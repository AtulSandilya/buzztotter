import theme from "../build/theme";

const checkSizeIsGrowing = (sizeObject) => {
  let lastSize;
  // This depends on the keys being in their initialized order
  for(const size of Object.keys(sizeObject)) {
    if(lastSize !== undefined) {
      if(lastSize > sizeObject[size]) {
        return false;
      }
    }
    lastSize = sizeObject[size];
  }
  return true;
}

describe("theme", () => {
  it("builds sizes correctly", () => {
    expect(checkSizeIsGrowing(theme.font.size)).toBe(true);
    // expect(checkSizeIsGrowing(theme.font.lineHeight)).toBe(true);
    expect(checkSizeIsGrowing(theme.padding)).toBe(true);
    expect(checkSizeIsGrowing(theme.margin)).toBe(true);

    // Sanity Check
    const sizeShrinking = {
      test: 2,
      next: 1,
      last: 0,
    }
    expect(checkSizeIsGrowing(sizeShrinking)).toBe(false);
  });

  it("has expected props", () => {
    expect(theme.colors).toBeDefined();
    expect(theme.font.size).toBeDefined();
    expect(theme.font.lineHeight).toBeDefined();
    expect(theme.font.weight).toBeDefined();
    expect(theme.padding).toBeDefined();
    expect(theme.margin).toBeDefined();
    expect(theme.notificationIcons).toBeDefined();
  });

  it("has buttons at least 44px tall", () => {
    const minButtonHeight = 44;
    const buttonHeight = theme.font.lineHeight.normal * theme.font.size.normal + (theme.padding.normal * 2);
    console.log("Button height is:", buttonHeight);
    expect(buttonHeight).toBeGreaterThanOrEqual(minButtonHeight);
  })
})
