import { ContactEmail, Decision, Fact, type LegalSection } from './LegalLayout'

export const termsIntro = (
  <>
    <p className="lead">
      These terms are the agreement between you and TrainPrompt for using the TrainPrompt app, the TrainPrompt connector for AI
      assistants, and this website.
    </p>
    <p>
      TrainPrompt is run by <Fact name="operator" hint="legal name of the operator" /> ("TrainPrompt", "we", "us"). By creating an
      account or using TrainPrompt, you agree to these terms and to how we handle your information as described in our{' '}
      <a href="/privacy">Privacy Policy</a>. If you don't agree, please don't use TrainPrompt.
    </p>
  </>
)

export const termsSections: LegalSection[] = [
  {
    id: 'early-access',
    title: 'Early access',
    body: (
      <>
        <p>
          TrainPrompt is in early access. Features will change, some will be removed, and the service may sometimes be unavailable or
          lose data. Keep your own copy of anything you can't afford to lose. We may change, pause or stop any part of TrainPrompt, and
          if we shut it down we'll give you reasonable notice where we can.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Who can use TrainPrompt',
    body: (
      <>
        <p>
          You must be at least <Fact name="minimumAge" hint="minimum age" /> years old and able to enter a binding agreement to use
          TrainPrompt. You can't use it if the law where you live forbids it.
        </p>
      </>
    ),
  },
  {
    id: 'account',
    title: 'Your account',
    body: (
      <>
        <p>
          You sign in with your email address, or with Apple or Google. Keep access to that email account and to your devices secure,
          because anyone who can sign in as you can use your TrainPrompt account. You're responsible for what happens under your
          account, including what the assistants you connect do with it.
        </p>
        <p>
          A personal access token works like a password. Don't share it or post it anywhere public, and revoke it on the Account
          screen if you think someone else has it.
        </p>
      </>
    ),
  },
  {
    id: 'health',
    title: 'Not medical advice',
    body: (
      <>
        <p>
          TrainPrompt stores and shows workout and meal plans. It doesn't check them. Your plans are written by the AI assistant you
          connect or by you, and AI can be wrong: it can suggest a weight that's too heavy, an exercise that doesn't suit your body,
          or nutrition numbers that are off. Calorie and macro figures are estimates for information only.
        </p>
        <p>
          Nothing in TrainPrompt is medical, nutritional or professional fitness advice, and it doesn't replace a doctor, dietitian or
          qualified coach. Talk to a doctor before starting a new exercise or eating plan, especially if you are pregnant, have an
          injury, a medical condition or a history of disordered eating. Stop and get help if something hurts or feels wrong.
        </p>
        <p>You decide what you lift and what you eat, and you take the risks of physical exercise and diet changes when you do.</p>
      </>
    ),
  },
  {
    id: 'assistants',
    title: 'Connecting AI assistants',
    body: (
      <>
        <p>
          When you connect an AI assistant, you're telling us to let it read and change your TrainPrompt data on your behalf, as
          described in the <a href="/privacy#ai-assistants">Privacy Policy</a>. We treat what it does as something you asked for.
        </p>
        <p>
          Assistants are made and run by other companies. Their own terms and privacy policies apply to your use of them, and we
          aren't responsible for what they say, write or do with your data. You can disconnect an assistant at any time by removing
          TrainPrompt from its settings or revoking its token.
        </p>
      </>
    ),
  },
  {
    id: 'your-content',
    title: 'Your content',
    body: (
      <>
        <p>
          Your plans, logs and notes are yours. You give us permission to store, copy, process and display them only as needed to run
          TrainPrompt for you, including passing them to the assistants you connect. This permission ends when your content is
          deleted, apart from backup copies that are removed on the schedule in the Privacy Policy.
        </p>
        <p>
          Don't add content you don't have the right to use, and don't put other people's personal information in your notes.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <>
        <p>Don't use TrainPrompt to:</p>
        <ul>
          <li>break the law or help anyone else break it;</li>
          <li>access or try to access another person's account or data;</li>
          <li>probe, scan or test our systems for weaknesses, or get around security or rate limits;</li>
          <li>send requests at a volume or in a way that disrupts the service for others;</li>
          <li>copy, resell or build a competing product from TrainPrompt, or reverse engineer it except where the law allows.</li>
        </ul>
        <p>
          If you find a security problem, please report it to <ContactEmail /> instead of testing it further.
        </p>
      </>
    ),
  },
  {
    id: 'ours',
    title: 'Our app and brand',
    body: (
      <>
        <p>
          TrainPrompt's app, connector, website, name and logo belong to us. While you follow these terms, we give you a personal,
          non-exclusive, non-transferable right to use TrainPrompt for your own training. If you send us feedback or ideas, we can use
          them without owing you anything.
        </p>
      </>
    ),
  },
  {
    id: 'fees',
    title: 'Fees',
    body: (
      <>
        <p>
          TrainPrompt is free during early access. If we introduce paid features, we'll tell you the price first, and we won't charge
          you unless you choose to pay.
        </p>
      </>
    ),
  },
  {
    id: 'ending',
    title: 'Ending your use',
    body: (
      <>
        <p>
          You can stop using TrainPrompt at any time and ask us to delete your account as described in the{' '}
          <a href="/privacy#your-choices">Privacy Policy</a>.
        </p>
        <p>
          We may suspend or close your account if you break these terms, if we have to by law, or if your use puts other people or
          the service at risk. Where it's reasonable, we'll tell you first and explain why. The sections on medical advice,
          disclaimers, liability, disputes and general terms keep applying after your account closes.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    body: (
      <>
        <p>
          TrainPrompt is provided "as is" and "as available". To the extent the law allows, we make no promises about it beyond those
          in these terms. In particular, we don't promise that it will be uninterrupted or error-free, that your data will never be
          lost, or that any plan, weight or nutrition figure in it is accurate, safe or right for you.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Limits on our liability',
    body: (
      <>
        <p>To the extent the law allows:</p>
        <ul>
          <li>
            we aren't liable for indirect, incidental, special or consequential losses, or for lost data, profits or goodwill, arising
            from your use of TrainPrompt;
          </li>
          <li>
            we aren't liable for injury or loss caused by following a plan, or by the actions of an AI assistant or other third-party
            service;
          </li>
          <li>
            our total liability for all claims relating to TrainPrompt is limited to the greater of what you paid us in the 12 months
            before the claim and <Fact name="liabilityCap" hint="cap amount" />.
          </li>
        </ul>
        <p>
          Some places don't allow these limits. Nothing in these terms limits liability for death or personal injury caused by our
          negligence, for fraud, or for anything else the law doesn't let us limit, and nothing takes away rights you have as a
          consumer that can't be waived.
        </p>
      </>
    ),
  },
  {
    id: 'indemnity',
    title: 'Responsibility for misuse',
    body: (
      <>
        <p>
          If someone makes a claim against us because you broke these terms or the law while using TrainPrompt, you agree to cover our
          reasonable costs of dealing with it, to the extent the law allows.
        </p>
      </>
    ),
  },
  {
    id: 'apple',
    title: 'If you got the app from the App Store',
    body: (
      <>
        <p>
          These terms are between you and us, not Apple. Apple isn't responsible for the app, its support or maintenance, or any
          claims about it, including product liability claims, claims that it fails to meet a legal or regulatory requirement, and
          intellectual property claims. If the app fails to meet a warranty that applies, you can tell Apple and Apple will refund the
          price you paid for it, if any; beyond that, Apple has no warranty obligation for the app. You must also follow Apple's terms
          for the App Store. Apple and its subsidiaries are third-party beneficiaries of these terms and can enforce them against you.
        </p>
      </>
    ),
  },
  {
    id: 'disputes',
    title: 'Governing law and disputes',
    body: (
      <>
        <p>
          If you have a problem with TrainPrompt, please contact us first at <ContactEmail /> so we can try to fix it. These terms are
          governed by the laws of <Fact name="governingLaw" hint="governing law" />, and disputes will be heard in{' '}
          <Fact name="venue" hint="courts for disputes" />. If you live in a country whose consumer laws give you the right to bring a
          claim in your local courts or under your local law, you keep that right.
        </p>
        <Decision>
          Choose the governing law and courts. Decide whether you want an arbitration agreement and class action waiver; this draft
          deliberately leaves them out, because they need a lawyer to draft and come with their own consumer rules.
        </Decision>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <>
        <p>
          We may update these terms as TrainPrompt changes. We'll post the new version here with a new effective date, and if a change
          matters we'll tell you in the app or by email before it takes effect. If you keep using TrainPrompt after that, the new terms
          apply. If you don't agree with them, stop using TrainPrompt and ask us to delete your account.
        </p>
      </>
    ),
  },
  {
    id: 'general',
    title: 'General',
    body: (
      <>
        <p>
          These terms and the Privacy Policy are the whole agreement between you and us about TrainPrompt. If a court finds part of
          them unenforceable, the rest still applies. If we don't enforce a term straight away, we can still enforce it later. You can't
          transfer your rights under these terms to someone else; we can transfer ours as part of a merger, sale or reorganization, and
          these terms will keep protecting you.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <>
        <p>
          Questions about these terms go to <ContactEmail />, or by post to <Fact name="operator" hint="legal name of the operator" />,{' '}
          <Fact name="address" hint="postal address" />.
        </p>
      </>
    ),
  },
]
