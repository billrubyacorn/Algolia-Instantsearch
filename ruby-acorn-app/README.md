## Ruby Acorn: Objectives & Accomplishments ##
My objective was to learn the entire Algolia process. From integrating to Ruby Acorn's Shopify website to seeing the Analytics in Algolia.  And I have done this. 

Understanding Algolia's process is extremely important as an Enterprise Solution Engineer.  We will be explaining to clients this process and show how Algolia's Analytics and Algolia's NeuralSearch, will drive X% of revenue growth.  I can see how this works in Algolia.   Hence, why I want to join the Algolia team.

### Questions & Learnings ###
Below are the questions I had and what I've learned. 
* **How easy would it be to integrate with an existing Shopify site?**  Extremely easy to integrate with RubyAcorn's Shopify account.  
* **How long to get a working integration live on the site?**  Within a few hours I had a working integration live at RubyAcorn.com

* **What issues would come up?**  The product data at Shopify was not normalized enough.  Creating the 15 new metafields in Shopify and then generating that content across the products took quite a bit of time.  Shopify and importing/exporting metafields is not supported.  

* **Ruby Acorn Dataset:** From the website of RubyAcorn.com, I pulled the product data and normalized the attributes for Algolia. In Shopify, I added 15 Meta product attributes of different types.  Created all the content for the 15 new metafields.  Shopify has limitations on importing/exporting Metafields.  I purchased a tool to speed up this process.

* **Does reconfiguration of the index make sense?**  Yes, setting the Sort order was easy.  Ranking Aloglia can only do that on single item fields,

* **How good is the documentation?**
* **Can I get a working version of the javascript running in a vm code environment?**
* **Can I create my own Recommendations and see the results?**

### Ruby Acorn: Backstory ###
**Who is RubyAcorn?**  My wife Martha runs her own company called Ruby Acorn.  She sells flower bulbs and live plants online. At the moment, only on Etsy:  https://www.etsy.com/shop/MarthasRubyAcorn   I am extremely proud of her and amazed at her success. 

Her business is growing fast and she wants to launch RubyAcorn.com by March 1st 2024.  As her severely underpaid CTO, it has been my job to get this done.  Since I am building her website anyway, I thought it was the perfect opportunity to integrate & learn Algolia.  

### Accomplishments ###
[RubyAcorn.com](https://RubyAcorn.com) is the best way to see what I have accomplished. 

At the Shopify website RubyAcorn.com, I have integrated my Algolia account and exposed it through the front end.  Both Search and Collections are powered by my Algolia account.  Application Name: Ruby Acorn App  Index: ruby_products

**Collections:** [Ruby Acorn Flower Bulbs Collection](https://rubyacorn.com/collections/flower-bulbs)   Or if you do a Search.  

**CSS & Formatting** - Yes, the CSS and the formatting is not set correctly.  RubyAcorn.com is running a $50 ThemeForest theme.  I see how Algolia allows me to set my own CSS style tags for InstaSearch, I just don't know what the Shopify CSS tags are.  I need to look them up and then set them.     

**Algolia**
---
- **Algolia Configurations** In the Algolia backend, I created a new application called Ruby Acorn App and created the index ruby_products.  I am not using My First Application.  
- **Searchable Attributes** - The 15 meta fields are set by importance.  And I understand all the details of why, sorted, unsorted, etc.  
- **Custom Ranking & Sort By** - I added a meta.popularity field and use it as both a Rank & Sort.  I understand why and how these work.   Does not support lists fields, which I had to work around.   All good.
- **Relevant Sorting** - Yes, I understand why this is important.  Free plan I cannot trigger. 
- **Personalization** - I turned this on and wanted to see the effect on RubyAcorn.com.  I studied this section too.
- **Dynamic Reranking** - I did not have a need for this, so did not turn it on.  I studied this section.
- **Relevance Optimizations** - I went through these sections too.  More of 1 time setup configurations.   Great to see the multi-lingual support out of the box.

- **Facets & Facets Display** - Took me a while to understand the difference of this section.  And how it impacted Shopify's front end.   Have a few questions in this area. 

- **Agolia Admin Access**: Admin access has been granted in my Algolia account.

- **Algolia Analytics** - I have been studying the analytics that are coming in from RubyAcorn.com.   Since the site is brand new and has no traffic, I can see analytics from the ground up.  Great analytics.  

**Events & Personalization** - I turned on Events and I see how they can be used in Personalization.  RubyAcorn.com has so little traffic that at the moment there is not enough data to trip this correctly.   I would like to learn more about Events.   

**Codesandbox.io**
I created an account at https://codesandbox.io/   I was able to connect my Github repo to codesandbox.io
Using the Branch01, I was able to successfully run the npx create-instantsearch-app@latest 'ruby-acorn-app'
And I was able to run "npx start" within the rupy-acorn-app to see my data being pulled over. Viewing on localport 3000.   I changed the header to dark red.  

**Feedback & Next Steps**
Overall I am impressed with Algolia.  In 2 weeks, with limited time, I was able to integrate an existing Shopify site, normalize the data, connect & configure an Algolia account, and launch it.  Getting the Github repo and the vm env installed is also quite helpful.   I understand how working on deals using a vm env with InstantSearch will be quite valuable.    Documenation was great and I was able to get everything done by myself. 

Looking forward to reviewing these details with the Algolia team.  

Thank you for your time and taking my employment seriously.  Would be excited to join the Algolia team. 

Happy Holidays

Bill Thomas


