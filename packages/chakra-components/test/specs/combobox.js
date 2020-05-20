describe("ComboBox Component", function() {
    it("iput change list sort", function() {
      browser.url("http://localhost:3000/combobox/");
      const Input = $("main").$("//div[7]/div[1]").$('input');
      Input.click();
      Input.setValue('Dan');
      browser.keys('Enter');
      browser.pause(2000)
      expect(Input.getValue()).toBe('Dan Abrahmov');
    });

    it("input blur clear input close list", function(){
      browser.url("http://localhost:3000/combobox/");
      const Input = $("main").$("//div[7]/div[1]").$('input');
      Input.click();
      Input.setValue('Dan');
      browser.keys('Escape');
      $("main").$("//h2[3]").click();
      browser.pause(2000)
      expect(Input.getValue()).toBe('');
    });

    it("input focus arrow direction change", function(){
      browser.url("http://localhost:3000/combobox/");
      const Input = $("main").$("//div[7]/div[1]").$('input');
      const svgPath = $("main").$("//div[7]/div[1]").$('svg').$('path').getAttribute('d');
      Input.click();
      browser.pause(2000);
      expect($("main").$("//div[7]/div[1]").$('svg').$('path').getAttribute('d')).not.toBe(svgPath)
    });
});