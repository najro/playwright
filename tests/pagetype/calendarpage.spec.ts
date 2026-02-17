import { test, expect } from '@fixtures/index';;
import { CalendarPage } from "src/pom/CalendarPage";

test.describe("CalendarPage", () => {

  test("Kalender klikk på flere hendelser knapp", async ({ page }) => {

    const url = "/no/aktuelt/kalender/id1330/?from=6.12.2023";
    const calendarPage = new CalendarPage(page);
    await calendarPage.gotoUrl(url);

    await calendarPage.hideCookieBannerSelectAll();
    
    await calendarPage.clickShowMoreButton();

    await calendarPage.expectTextToBeVisible("Olje- og energiministeren har møte med Finnmarkseiendommen");


    // await calendarpage.gotoUrl(url);
    // await calendarpage.hideCookieBannerSelectAll();    
    // await calendarpage.clickShowMoreButton();
    // await calendarpage.expectTextToBeVisible("Olje- og energiministeren har møte med Finnmarkseiendommen");
  });

});