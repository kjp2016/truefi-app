export type Message = {
  id: number;
  content: string;
  role: string;
  autoNextStep?: boolean;
  images?: string[];
};


export const MESSAGES: Message[] = [
  {
    id: 1,
    content: 'Hey there, Alex! 😊 Need any help with your finances today?',
    role: 'assistant',
    autoNextStep: false,
  },
  {
    id: 2,
    content: 'Overall, your spending is in great shape! I did notice that your restaurant expenses were a bit higher this month, but that was around your Cabo trip—hope you enjoyed those margaritas! 🍹 No worries, though; you’re still on track to hit your savings goal for the quarter',
    role: 'assistant',
    autoNextStep: false
  },
  {
    id: 3,
    content: `Exciting times! 🏡 I can walk you through the differences between buying and renting and
              help you see what works best financially for you. Here’s what we can do:</br></br>
              <ol class="number-list">
                <li><strong>Quick Educational Overview:</strong> A simple breakdown of the pros and cons of
              homeownership vs. renting, tailored to your financial situation.</li>
                <li><strong>High-Level Analysis:</strong> A look at what you can comfortably afford if you decide to buy.</li>
                <li><strong>Detailed Financial Modeling:</strong> If you want, I can pull up specific property examples and
              do a deep dive on how buying would impact your wealth in the long term.</li>
              </ol></br>
              Which option would you like to start with?`,
    role: 'assistant',
    autoNextStep: false
  },
  {
    id: 4,
    content: `Before we start, I would love to give you a snapshot of what you can currently afford if you
              wanted to buy a house today. Also, if you have a specific property in mind, just share the
              address, or I can use an example from the market for our analysis.</br></br>
              Based on your current income, short-term goals, long-term financial objectives, projected
              salary growth in your consulting role, age, credit history, and some practical contingencies,
              here’s what I’d suggest for an ideal home purchase scenario:</br></br>
              <ul class="ul-list">
                <li><strong>Purchase Price:</strong> $500,000 – This price range aligns with your monthly income and
              budget flexibility, keeping your finances healthy while allowing you to focus on other
              goals.</li>
                <li><strong>Down Payment:</strong> 20% ($100,000) – A 20% down payment helps you avoid private
              mortgage insurance (PMI), reducing monthly costs and securing a more favorable
              loan structure.</li>
                <li><strong>Interest Rate:</strong> 7.445% – Reflects the current market average, though I’ll keep an eye
              out for opportunities to refinance if rates drop.</li>
                <li><strong>Loan Term:</strong> 30 years – A 30-year term balances monthly affordability with
              manageable long-term debt, leaving more cash for your lifestyle and investments.</li>
                <li><strong>Property Taxes:</strong> Estimated around $3,750 per year – Calculated based on local
              property tax rates, this estimate keeps you prepared for any tax adjustments.</li>
                <li><strong>Home Insurance:</strong> Approximately $2,500 per year – A standard insurance estimate
              for this property type and area, ensuring adequate coverage without overextending
              your budget.</li>
                <li><strong>Maintenance Costs:</strong> About 1% of the home value, or $5,000 per year – It’s wise to
              set aside around 1% annually for repairs and maintenance, helping you avoid
              surprise expenses.</li>
                <li><strong>Closing Costs:</strong> 4% ($20,000) – Typical closing costs that cover legal, appraisal, and
              administrative fees, giving you a realistic view of upfront costs.</li>
              </ul></br>
              Your <strong>total monthly housing cost</strong> for a $500,000 property would be around <strong>$3,719</strong>. This
              setup keeps you within budget while building equity, without over-stretching on upfront
              costs or monthly payments. How does that sound?"`,
    role: 'assistant',
    autoNextStep: false
  },
  {
    id: 5,
    content: `I’ve got it! Here are the key details for 9400 Roxanna Dr, Austin, TX:</br></br>
              <ul class="ul-list">
                <li><strong>Purchase Price:</strong> $545,000</li>
                <li><strong>Down Payment:</strong> 20% ($109,000)</li>
                <li><strong>Loan Amount:</strong> $436,000</li>
                <li><strong>Interest Rate:</strong> 7.445%</li>
                <li><strong>Loan Term:</strong> 30 years</li>
                <li><strong>Annual Property Taxes:</strong> $4,536</li>
                <li><strong>Annual Home Insurance:</strong> $3,000</li>
                <li><strong>Maintenance Costs:</strong> About 1% of home value, or $5,450</li>
              </ul></br>
              Based on these details, your estimated monthly housing costs would be about <strong>$4,114</strong>.
              Now, here’s a comparison to help decide if this purchase aligns with your goals.<br><br>
              <ol class="number-list">
                <li><strong>Rent and Invest:</strong> Continue renting and invest your down payment in a low-risk fund to
                grow your wealth.</li>
                <li><strong>Buy the Home:</strong> Purchase the property and build equity, letting you compare the impact
                on your wealth over time.</li>
              </ol>`,
    role: 'assistant',
    autoNextStep: true
  },
  {
    id: 6,
    content: `Here’s the key takeaway:</br></br>
              <ul class="ul-list">
                <li><strong>Breakeven Point:</strong> If you buy, you’d surpass the financial benefits of renting around
                  year 10. If you plan to stay in the home for at least 10 years, buying would start to
                  improve your long-term wealth. But if you’re thinking of moving sooner, renting may
                  be more cost-effective in the short term.</li>
              </ul></br>
              <img src="/breakeven-graph.png"></img>
              <br>
              Here’s the full <strong>Excel model</strong> where you can adjust assumptions and run additional
              scenarios: <a class="link" target="_blank" href="https://ucla.sharepoint.com/:w:/s/BCPTeamnibi.ai/EbOsBgF7PN9HnmLkHKXqzQgBvITS9dJcdExNenAXFlWK3w?e=KeXaS0">Breakeven Analysis</a>`,
    role: 'assistant',
    autoNextStep: false
  },
  {
    id: 7,
    content: `Good question! With your current income and savings goals, you’re well-positioned.
              Here’s how we can adjust your budget to make it work comfortably:</br></br>
              <ol class="number-list">
                <li><strong>Car Budget Adjustment:</strong> You’re on track to purchase the $30,000 car you want in 24
                  months. Our original plan was to make a 5% down payment with a 48-month term.
                  However, with your upcoming home purchase, you might consider adjusting to a $22,800
                  certified pre-owned model. By putting 5% down and extending the term to 60 months, you
                  can stay within budget without impacting your retirement timeline. This approach keeps
                  your finances intact while accommodating both goals.</li>
                <li><strong>Gym Membership:</strong> Consider switching from Equinox to LA Fitness.</li>
                <li><strong>Dining Out Less:</strong> Reducing dining out from 3x a week to 1x could save around $300 monthly</li>
              </ol></br>
              These adjustments would cover the extra housing cost without affecting your long-term
              goals, like retirement or your down payment for a future investment property`,
    role: 'assistant',
    autoNextStep: false
  },
  {
    id: 8,
    content: `Great choice! Here’s a summary of your updated budget with the new home included:</br></br>
              <ul class="ul-list">
                <li><strong>Monthly Housing Cost:</strong> $4,114</li>
                <li><strong>Savings Goals:</strong> Still on track for retirement and emergency fund.</li>
                <li><strong>Adjustments:</strong> Reduced dining out, gym membership, and car budget.</li>
              </ul></br>
              With these changes, you’re set to move forward without compromising your financial
              goals. I’ll keep an eye on your budget and notify you if any adjustments are needed. 😊
              Ready to make this move?`,
    role: 'assistant',
    autoNextStep: false
  },
  {
    id: 9,
    content: `Anytime, Alex! I’m here to help every step of the way. Let me know when you’re ready for more financial insights! 🏡✨`,
    role: 'assistant',
    autoNextStep: false
  },
];