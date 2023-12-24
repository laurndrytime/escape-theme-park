# Sanity Blogging Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- Check out the example frontend: [React/Next.js](https://github.com/sanity-io/tutorial-sanity-blog-react-next)
- [Read the blog post about this template](https://www.sanity.io/blog/build-your-own-blog-with-sanity-and-next-js?utm_source=readme)
- [Join the community Slack](https://slack.sanity.io/?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

---

Lauryn:

- we are currently using sanity-codegen to generate types. was looking at their client api, which looks promising but lacking some features that i want to try having with @sanity/client.
- for now, we need to type each query ourselves (which can be troublesome), but we also have the ability to create / patch data directly using the client api which can be useful.
- as such, for now we can just keep to this, but when sanity-codegen improves their client api, we can switch over since that will become fully typed! :D
