import { facts } from './facts'
import { ContactEmail, ContactUs, type LegalSection } from './LegalLayout'

// Every statement here should match what the app, the MCP server and this site
// actually do. If the product changes what it collects or who it shares with,
// change this page in the same pull request.

export const privacyIntro = (
  <>
    <p className="lead">
      TrainPrompt is a gym and meals app that your own AI assistant fills in. This policy explains what we keep about you, why, who
      else handles it, and the choices you have.
    </p>
    <p>
      {facts.operator && <>TrainPrompt is run by {facts.operator} ("TrainPrompt", "we", "us"). </>}
      This policy covers the TrainPrompt iPhone app, the TrainPrompt connector that AI assistants use (our MCP server), and this
      website at trainprompt.app.
    </p>
  </>
)

export const privacySections: LegalSection[] = [
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: (
      <>
        <h3>Your account</h3>
        <ul>
          <li>Your email address, which you use to sign in. We send a one-time code to it each time you sign in with email.</li>
          <li>
            If you sign in with Apple or Google, the basic profile details that provider shares with us, such as your name and email
            address. Apple lets you hide your real email address; if you do, we only see the relay address Apple gives us.
          </li>
          <li>
            A first name for the app to greet you with. We take it from your sign-in details, or from the part of your email address
            before the @, and you can change it at any time.
          </li>
          <li>Whether you use kilograms or pounds.</li>
        </ul>

        <h3>Your training and meals</h3>
        <ul>
          <li>
            Your plan: which days are training or rest days, the exercises for each day with their sets, reps, rest times and target
            weights, and the meals for each day with their ingredients, steps, preparation time and estimated calories and macros.
          </li>
          <li>
            What you log: the weight and reps for each set, how hard it felt, when you logged it, and which meals you marked as eaten.
          </li>
          <li>Notes you or your assistant add to a day, an exercise or a set.</li>
        </ul>
        <p>
          Notes are free text, so they hold whatever you or your assistant write. A note about an injury or a diet, for example, tells
          us something about your health. Please leave out anything you'd rather we didn't store.
        </p>

        <h3>Connections to AI assistants</h3>
        <ul>
          <li>
            If you create a personal access token, we store a one-way hash of it, the date you created it and when it was last used.
            We never store the token itself, so we can't show it to you again.
          </li>
          <li>
            If you connect an assistant by signing in through it, our sign-in provider records that the assistant is allowed to act
            for your account.
          </li>
        </ul>

        <h3>Technical information</h3>
        <p>
          When your phone, your browser or an assistant talks to our servers, the companies that run those servers receive the IP
          address and basic details of the request, such as the time and the type of browser or app. They use this to deliver the
          request, keep the service secure and record errors. When something fails, we may see an error log for that request.
        </p>

        <h3>What we don't collect</h3>
        <p>
          The app does not read Apple Health, your location, your contacts, your camera or your photo library. It doesn't ask for your
          age, sex, height, body weight or body measurements. We don't use advertising identifiers, analytics or tracking tools in the
          app or on this website, and we don't take payments.
        </p>
      </>
    ),
  },
  {
    id: 'ai-assistants',
    title: 'Your AI assistant',
    body: (
      <>
        <p>
          TrainPrompt works by letting an AI assistant you already use, such as Claude or ChatGPT, read and write your plan. When you
          connect one, it can:
        </p>
        <ul>
          <li>read your first name, your units, your plan and your logged sets and meals;</li>
          <li>change your first name and units;</li>
          <li>add, replace and clear the training days, rest days and meals in your plan.</li>
        </ul>
        <p>
          It cannot delete the sets you've logged, and each connection only reaches your own account. TrainPrompt's tools don't
          give an assistant your email address. If you connect by signing in through the assistant, though, the approval screen
          lists the account details the connection can see, which may include your name and email address.
        </p>
        <p>
          The assistant is run by its own provider, not by us. What it reads from TrainPrompt becomes part of your conversation with
          it, and that provider's privacy policy and settings decide how it is stored and used, including whether it is used to train
          their models. Check those settings before you connect.
        </p>
        <p>
          TrainPrompt itself does not send your data to any AI company. Data only goes to an assistant you have connected, and only
          when that assistant asks for it.
        </p>
        <p>
          Your assistant may attach a photo link to an exercise or meal. The app loads that photo directly from the website the link
          points to, so that website sees your phone's IP address, as it would if you opened the link yourself.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How we use your information',
    body: (
      <>
        <p>We use what we collect to:</p>
        <ul>
          <li>sign you in and keep your account secure;</li>
          <li>store your plan and logs and show them in the app;</li>
          <li>let the assistants you connect read and update your plan;</li>
          <li>find and fix problems, and stop abuse of the service;</li>
          <li>contact you about your account or important changes to TrainPrompt;</li>
          <li>meet our legal obligations.</li>
        </ul>
        <p>
          We don't sell your personal information, we don't use it for advertising, and we don't use it to train AI models.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Who we share it with',
    body: (
      <>
        <p>We share your information only with:</p>
        <ul>
          <li>
            <strong>Clerk</strong>, which runs sign-in. It holds your email address and sign-in details, sends your sign-in codes and
            manages the connections you approve for AI assistants.
          </li>
          <li>
            <strong>Convex</strong>, which hosts our database and servers. It stores your plan, logs, profile and token hashes.
          </li>
          <li>
            <strong>Vercel</strong>, which hosts this website.
          </li>
          <li>
            <strong>Apple or Google</strong>, if you choose to sign in with them. They confirm who you are under their own privacy
            policies.
          </li>
          <li>
            <strong>AI assistants you connect</strong>, as described above, because you've asked them to work with your account.
          </li>
        </ul>
        <p>
          Clerk, Convex and Vercel handle your information on our behalf to provide their services to us. We may also disclose
          information if the law requires it, to protect someone's safety or our rights, or as part of a merger, sale or similar
          transfer of TrainPrompt.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and storage',
    body: (
      <>
        <p>
          The main pages of this website set no cookies and run no analytics. The sign-in pages use cookies and browser storage from
          Clerk because signing in doesn't work without them. In the app, your sign-in session is kept in the iPhone's secure storage.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    body: (
      <>
        <p>
          We keep your account, plan and logs for as long as you have an account, so your training history is there when you or your
          assistant need it. When you delete a set or a token, or your assistant replaces part of your plan, the old record is deleted
          from our database straight away.
        </p>
        <p>
          Deleted information can stay in our providers' backups and logs
          {facts.backupRetention ? <> for up to {facts.backupRetention}</> : <> for a period</>} before it is erased. We may keep
          information longer if the law requires us to.
        </p>
      </>
    ),
  },
  {
    id: 'your-choices',
    title: 'Your choices and rights',
    body: (
      <>
        <ul>
          <li>You can see and edit your plan and logs in the app, and change your name and units on the Account screen.</li>
          <li>You can delete individual logged sets in the app.</li>
          <li>
            You can revoke personal access tokens on the Account screen, and remove TrainPrompt from your assistant's settings to stop
            it connecting.
          </li>
          <li>
            You can <ContactUs>contact us</ContactUs> to ask for a copy of your information, to correct it, or to delete your account.
          </li>
        </ul>
        <p>
          Depending on where you live, you may have more rights over your personal information. These can include the right to know
          what we hold, to get a copy you can take elsewhere, to correct or delete it, to object to or restrict how we use it, and to
          withdraw consent. You also have the right not to be treated differently for using any of them. We'll answer requests within
          the time the law where you live allows, and we may need to confirm it's really you first. If you think we've handled your
          information wrongly, you can complain to the data protection authority where you live.
        </p>
        <p>
          If you are in the European Economic Area or the United Kingdom, we rely on these legal grounds: we need your information to
          provide the service you signed up for; we have a legitimate interest in keeping TrainPrompt secure and working; and in some
          cases the law requires it.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <>
        <p>
          All traffic to TrainPrompt is encrypted in transit. We store personal access tokens only as one-way hashes, the app keeps your
          session in the iPhone's secure storage, and every request is checked so it can only reach the account it belongs to. No
          system is perfectly secure, though. Treat a personal access token like a password: anyone who has it can read and change your
          plan until you revoke it.
        </p>
      </>
    ),
  },
  {
    id: 'international',
    title: 'Where your data is processed',
    body: (
      <>
        <p>
          Our service providers may store and process your information in the United States and other countries, which may have
          different data protection laws from yours.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <>
        <p>
          {facts.minimumAge ? (
            <>
              TrainPrompt is for people aged {facts.minimumAge} and over. We don't knowingly collect personal information from anyone
              younger.
            </>
          ) : (
            <>TrainPrompt isn't made for children, and we don't knowingly collect personal information from them.</>
          )}{' '}
          If you believe a child has given us their information, please <ContactUs /> so we can remove it.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <>
        <p>
          We may update this policy as TrainPrompt changes. When we do, we'll post the new version on this page.
        </p>
      </>
    ),
  },
  ...(facts.contactEmail
    ? [
        {
          id: 'contact',
          title: 'Contact us',
          body: (
            <>
              <p>
                Questions or requests about your privacy go to <ContactEmail />.
                {facts.operator && facts.address && (
                  <>
                    {' '}
                    You can also write to {facts.operator}, {facts.address}.
                  </>
                )}
              </p>
            </>
          ),
        },
      ]
    : []),
]
