## Customer Responses ##

Algolia Team, 

Below are my answers to the customer questions provided.   I did not add markup details since these are email replies. 

Thank You 
Bill Thomas

---
**Question 1: New to Search**

Hello,

I'm new to search engines, and there are a lot of concepts I'm not educated on. To make my onboarding smoother, it'd help if you could provide me with some definitions of the following concepts:
- Records
- Indexing

I'm also struggling with understanding what types of metrics would be useful to include in the "Custom Ranking."

Cheers, George

Hi George,

Great to hear you are interested in learning more about search engines.  Yes, we can get you educated on search engines concepts, like Records, Indexing, and Custom Ranking. We do it everyday, it's our passion. 

Your 1st question is on Records & Indexes.  In Algolia terms, a Record is a "single item".  For example, every Product will have a Record in Algolia. 100 Products = 100 Records.  An Index, that is where the Records are stored. All of the Products will be stored inside of an Index.  1 Index, named All-Products, has 100 Records in it. 

What is inside of a Record you ask? Good question. Inside of a Record will be various Attributes. Attributes describe what is in this Record.  For example, a Product will have a lot of Attributes:  Name, Title, Price, etc. All of these will be stored in a Record.  

Below is a link to a simple course that explains these concepts in more detail:
Send Data to Algolia with the Dashboard: Records & Indexes
https://academy.algolia.com/training/a3f77490-7781-11ec-91df-02aea812ea2d/overview

Your 2nd question is what are typical metrics for Custom Ranking. Custom Ranking is a great way to ensure the products that customers want to buy, right now, are displayed at the top of the list.   Conversely, products that you want buried, making it harder for customers to find, can be done through "Custom Ranking" 

Algolia typically sees these types of metrics used for "Customer Ranking":

- High_Purchase_Volume_Last_30_Days - Products that have been purchased the most of the last 30 days.  During the holiday season, what is moving fast is pushed to the top. You don’t figure out 

- Most_Viewed_Last_7_days - Products people are viewing the most.  When a new customer visits the site, they are seeing the products that people are interested in right now.  Another way to show products that have your customer’s attention.  

- Popularity - A score or based on reviews, which products do customers like the most.  These get pushed to the top. 

- Has_IoT - If a product has new IoT capabilities push these to the top.

- New_Certification - If products require certifications and these are new/renewed shows at the top.  People are looking for these.

- Price - You can use Price to push products up or down... your choice

- Inventory - Products with high inventory levels, push to the top.

- Loss_Leader - Products that you’ve defined as a Loss Leader are buried in the rankings.  

The power of Algolia is that you are free to use your own custom metrics for rankings.  Nobody knows your customers better than you.  "Custom Rankings" helps you leverage that knowledge to make Algolia's AI work better.  Better means high conversion rates & higher revenue.  

Algolia is a AI Search & Discovery platform
Records & Indexes, Custom Ranking, this is just the beginning. We recommend that you start with learning "What is Algolia".  Understanding the high-level view will help make your onboarding smoother.  

What is Algolia
https://www.algolia.com/doc/guides/getting-started/what-is-algolia/

Bookmark the Algolia Documentation link for future reference:
https://www.algolia.com/doc/

Next Steps
Let us know if you have any questions on these concepts. We are happy to help. 

Can you provide some background on yourself, your company and overall objectives you are trying to achieve?  Why are you learning search engine concepts? Which website are you looking to revamp the search on?  Do you have a project defined?  Any details would be great so we can learn more.  

Algolia is proud that we partner with our customers. We take the time to explain the important concepts & learn about your objectives.   The goal is to ensure we all succeed. 

Have a wonderful holiday season.    

Bill Thomas
Enterprise Solutions Engineer
Algolia 
---
**Question 2: Dashboard Feedback**

Hello,

Sorry to give you the kind of feedback that I know you do not want to hear, but I really hate the new dashboard design. Clearing and deleting indexes are now several clicks away. I am needing to use these features while iterating, so this is inconvenient.

Regards,
Matt

Hi Matt, 

We appreciate all feedback, good & bad.  It is important for us to understand what you do not like about the new Dashboard design.    Algolia is always looking to improve.  

Regarding your specific issue, clearing and deleting indexes is not something we see being done on an iterative basis.  Normally all edits are done within the index and any changes are immediately displayed.  Algolia is designed with exceptional performance.    

If you explain in more detail what you are doing, we may be able to help you with a better process.  Is this part of an existing project?   

We look forward to hearing from you. 

Happy Holidays,
Bill Thomas
Enterprise Solutions Engineer
Algolia 
---
**Question 3:  Effort to Integrate**

Hi,

I'm looking to integrate Algolia in my website. Will this be a lot of development work for me? What's the high level process look like?

Regards,
Leo

Hi Leo, 

No, it is not a lot of development work. Algolia was engineered to be easily integrated into your website.   Algolia can be implemented in just four steps.

1. Send your data
The very first step is to send your data to Algolia’s servers - to ensure your users get the fastest search and discovery experience possible. 

2. Configure relevance
The second step is to configure relevance - to give your users the best results for them and for your business. Although Algolia offers incredibly powerful features to fine tune and improve relevance, you just have to configure 2 settings to get started: searchable attributes and custom ranking.

3. Build search UI
The third step is to build the search UI - to provide your users with an awesome interface to search and browse. That can be coded with one of our InstantSearch libraries, which provide fully customizable front-end widgets that you can quickly assemble into a unique search interface. And the InstantSearch library is available for many frameworks: Angular, React, Vue, etc.

4. Iterate
Iteration is an important step.  You can use our Analytics to get insights into your search’s performance, to make informed changes. Or automate this process by using our more advanced features, such as our AI suite to release the full potential of Algolia.

Algolia also provides a set of tools that simplify the process of making and integrating a full search experience into your sites and applications. These include:
* Backend API clients, in many different languages, to index, configure, and manage your data.
* Frontend widgets to build web and mobile search experiences.
* Integrations with popular frameworks and platforms, to further simplify the integration of Algolia in your existing projects.
* A secure, Distributed Search Network that hosts your content and serves it to your users quickly.
* A transparent, customizable relevance algorithm.
* A heavily optimized search engine built, from scratch, in C++.
* Extensive documentation, implementation guides, and code examples.

Algoia recommends you start by visiting the Quick Start section in our documentation.  Let us know what questions you have after reviewing this section.

Quick Start:
https://www.algolia.com/doc/guides/getting-started/quick-start/

Next Steps
Leo it would be great to learn more about your business & objectives.  We can discuss how to integrate Algolia’s AI Search & Discovery to increase conversions and drive more revenue. 

Thank you for reaching out.  Have a wonderful holiday season.    

Cheers,
Bill Thomas
Enterprise Solutions Engineer
Algolia

