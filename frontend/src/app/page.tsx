import { MotionDiv } from "@/shared/lib/motion";
import { Button } from "@/shared/ui/button";
import { CustomIcon } from "@/shared/ui/custom-icon";
import Image from "next/image";
import Link from "next/link";

const blog = [
  {
    image: "/images/landing-page/Cheapest-CS2-Skins-958x575.png",
    title: "04 February 2025",
    description: "Cheapest CS2 Skins in 2025 – [TOP 13]",
    url: "https://tradeit.gg/blog/cheapest-cs2-skins",
  },
  {
    image: "/images/landing-page/Best-CS2-Skins.png",
    title: "07 February 2025",
    description: "Best CS2 Skins of 2025 – TOP 23 Weapon Skins",
    url: "https://tradeit.gg/blog/best-cs2-skins",
  },
  {
    image: "/images/landing-page/Most-expensive-skins.png",
    title: "06 February 2025",
    description: "Most Expensive CS2 Knife Skins in 2025 [TOP 11]",
    url: "https://tradeit.gg/blog/most-expensive-cs2-knife",
  },
  {
    image: "/images/landing-page/Next-Skin-Drop.png",
    title: "14 February 2025",
    description: "CS2 Drop Pool 2025: What CS2 Skins Will Drop",
    url: "https://tradeit.gg/blog/cs2-drop-pool",
  },
];

export default function Home() {
  return (
    // <MainLayout>
    // <div className="container bg-red-500">Тут будет Лендинг</div>
    // </MainLayout>
    <>
      <section className="container pt-[128px] pb-10">
        <div className="flex justify-between">
          <div className="max-w-[650px] pt-8">
            <Link
              href={"https://www.trustpilot.com/review/tradeit.gg"}
              target="_blank"
              className="sans flex w-fit items-center gap-1 text-sm font-medium tracking-tight text-white"
            >
              See our <strong>18,893</strong> reviews on
              <CustomIcon.TrustPilot />
            </Link>
            <div className="mt-8">
              <h1 className="mb-4 text-6xl leading-[72px]">
                Instant, Secure <br />
                CS2 Skin Trading
              </h1>

              <div className="pb-8">
                <p className="text-lg font-bold">
                  Trade CS2 (CS:GO) skins with fast trading bots
                </p>
                <p className="text-muted text-lg font-medium">
                  Tradeit.gg is the highest rated CS2 (CSGO) skin trading site.
                </p>
                <p className="text-muted text-lg font-medium">
                  The best trading bot for instant trades with the lowest fees.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Button className="h-[56px] w-[244px] rounded-[8px] text-lg">
                  Trade Skins Now
                </Button>
                <p className="ml-7 flex items-center gap-2 text-lg">
                  {/* <Gift size={20} /> */}
                  <CustomIcon.Awesome
                    name="gift"
                    gradient
                    type="fas"
                    className="size-4 text-base"
                  />
                  Register now and get $5 bonus
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-[576px] items-center justify-between select-none">
            <Image
              src="/images/landing-page/left.png"
              alt=""
              width={224}
              height={445}
            />

            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
            >
              <Image
                src="/images/landing-page/arrow.png"
                alt=""
                width={70}
                height={70}
              />
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.8,
                ease: "easeOut",
              }}
            >
              <Image
                src="/images/landing-page/right.png"
                alt=""
                width={220}
                height={172}
              />
            </MotionDiv>
          </div>
        </div>
        <div className="relative -z-10 mt-10">
          <div className="gradient absolute h-[350px] w-full -translate-y-2/3"></div>
          <div className="mx-auto w-fit text-center">
            <p className="text-2xl font-bold">61,608,799</p>
            <p className="text-sm font-bold text-[#615dfc] uppercase">
              TOTAL TRADES
            </p>
          </div>
        </div>
      </section>
      <section className="container mt-[128px] mb-[64px] flex items-center gap-8">
        <div className="bg-card relative flex-1 rounded-lg py-12 pl-10 opacity-90 hover:opacity-100">
          <div className="h-[133px] w-fit max-w-[260px]">
            <p className="text-2xl font-semibold">Trusted by legends.</p>
            <p className="text-muted mt-4 mb-3 font-medium">
              Trusted by esteemed pro players and major gaming brands.
            </p>
            <Image
              src={"/images/landing-page/faceit-logo.png"}
              width={180}
              height={26}
              alt=""
            />
          </div>
          <Image
            className="absolute right-0 bottom-0 rounded-br-lg"
            src={"/images/landing-page/faceit-bg.png"}
            width={283}
            height={277}
            alt=""
          />
        </div>
        <Link
          href={"https://vitality.gg/en-world"}
          target="_blank"
          className="bg-card relative flex-1 rounded-lg py-12 pl-10 opacity-90 hover:opacity-100"
        >
          <div className="h-[133px] w-fit max-w-[260px]">
            <p className="mb-4 text-2xl font-semibold">
              Partnered with <br />
              the best team.
            </p>

            <Image
              src={"/images/landing-page/vitality-logo.png"}
              width={180}
              height={48}
              alt=""
            />
          </div>
          <Image
            className="absolute right-0 bottom-0 rounded-br-lg"
            src={"/images/landing-page/vitality-bg.png"}
            width={344}
            height={277}
            alt=""
          />
        </Link>
      </section>
      <div
        className="py-[64px]"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, #15151c 100%)",
        }}
      >
        <section className="container flex items-start justify-around">
          <div className="flex w-fit max-w-[196px] flex-col items-center">
            <CustomIcon.Awesome
              name="right-left"
              gradient
              type="fas"
              className="text-3xl"
            />
            <p className="mt-4 mb-2 text-2xl font-bold">Trade CS2 skins</p>
            <p className="text-muted text-center text-base">
              Upgrade your skins to the latest collections easily and safely.
            </p>
          </div>
          <div className="flex w-fit max-w-[196px] flex-col items-center">
            <CustomIcon.Awesome
              name="cart-shopping"
              gradient
              type="fas"
              className="text-3xl"
            />
            <p className="mt-4 mb-2 text-2xl font-bold">Buy skins</p>
            <p className="text-muted text-center text-base">
              Explore our CS2 marketplace for the best deals.
            </p>
          </div>
          <div className="flex w-fit max-w-[196px] flex-col items-center">
            <CustomIcon.Awesome
              name="dollar-sign"
              gradient
              type="fas"
              className="text-3xl"
            />
            <p className="mt-4 mb-2 text-2xl font-bold">Sell skins</p>
            <p className="text-muted text-center text-base">
              Sell your skins quickly for instant cash or list them for sale.
            </p>
          </div>
          <div className="flex w-fit max-w-[196px] flex-col items-center">
            <CustomIcon.Awesome
              name="gift"
              gradient
              type="fas"
              className="text-3xl"
            />
            <p className="mt-4 mb-2 text-2xl font-bold">Free giveaways</p>
            <p className="text-muted text-center text-base">
              Join free giveaways to win exclusive CS2 skins.
            </p>
          </div>
        </section>
      </div>

      <div className="bg-[#121216]">
        <div className="relative container my-[100px] flex h-[400px] items-center overflow-hidden rounded-lg bg-[#16161d] pl-[100px] opacity-90 hover:opacity-100">
          <div
            className="pointer-events-none absolute -top-[200px] -left-[200px] z-0 h-[600px] w-[600px]"
            style={{
              background:
                "radial-gradient(circle at center, #3a35fb15 0%, #3a35fb00 85%)",
            }}
          />

          <div className="relative z-10 max-w-[336px]">
            <p className="text-5xl leading-14">
              Get $5 bonus free on your first trade!
            </p>
            <Button className="mt-6 block h-[56px] text-lg">
              Get Started Now
            </Button>
          </div>

          <div className="absolute top-0 right-0 h-full flex-1">
            <Image
              src={"/images/landing-page/first-bonus-right.png"}
              alt=""
              width={760}
              height={400}
            />
          </div>
        </div>
        <div className="container mb-[64px]">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-4xl font-medium">CS2 Skin Exchange Made Easy</p>
            <Link href={"https://tradeit.gg/blog"}>
              <Button className="text-base">Show More</Button>
            </Link>
          </div>
          <div className="flex justify-between">
            {blog.map((item, i) => (
              <Link
                href={item.url}
                className="w-fit overflow-hidden rounded-lg p-2"
                key={i}
              >
                <Image
                  className="rounded-md"
                  width={279}
                  height={168}
                  alt=""
                  src={item.image}
                />
                <div className="mt-3 max-w-[279px]">
                  <p className="text-muted text-sm font-medium">{item.title}</p>

                  <p className="text-base font-bold">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <section className="container mb-[64px]">
          <p className="my-6 text-4xl font-medium">Additional information</p>

          <div className="seo-content-wrapper rounded-lg bg-[#16161d] p-[52px]">
            <div className="seo-content mb-8 rounded-lg">
              <h2>
                <span>How to trade skins instantly with Tradeit</span>
              </h2>
              <ol className="list-inside list-decimal">
                <li>
                  <span>
                    <strong>Select your items:</strong> Choose what you want to
                    trade from your inventory.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Select wanted items from Tradeit inventory:</strong>{" "}
                    Pick the items you desire from our wide selection of over
                    800,000 skins.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Receive a trade offer instantly:</strong> Confirm
                    the trade, and your items will be on their way.
                  </span>
                </li>
              </ol>
              <h2>
                <span>Begin Your CS2 Trading Journey with Tradeit</span>
              </h2>
              <p>
                <span>
                  Whether you&apos;re keen on skin trading, searching for the
                  best CS2 trading bot, or eager to exchange skins, Tradeit is
                  your ultimate hub. Join us and be part of the CS2 (CS:GO)
                  trading revolution! Crowned one of the best CS2 (CSGO) trading
                  sites by over 18,000 reviews by CS2 skin traders.&nbsp;
                </span>
              </p>
              <h2>
                <span>
                  Experie­nce the thrill of real-time­ trading with CS2 Live
                  Trading
                </span>
              </h2>
              <p>
                <span>
                  Utilize a CS2 trade bot to quickly set up and carry out your
                  trades. Trade CS2 skins in real time and ensure you receive
                  your items when you want them… Instantly!
                </span>
              </p>
              <h2>
                <span>CS2 Skin Exchange Made Easy</span>
              </h2>
              <p>
                <span>
                  Trading in CS2 has never been easier. Our platform is designed
                  to make the skin exchange process for CS2 skins seamless and
                  hassle-free, ensuring you get excellent value every time. We
                  also update you on trends, such as popular, cheap, and
                  expensive skins.
                </span>
              </p>
              <h2>
                <span>
                  How we stand out from other CS2 (CSGO) trading sites
                </span>
              </h2>
              <p>
                <span>
                  At Tradeit, we focus on five key factors that contribute to an
                  unmatched trading experience; see below:
                </span>
              </p>
              <h3>
                <span>Low trading fees</span>
              </h3>
              <p>
                <span>
                  We strive to provide our users the most competitive fees among
                  CS trading sites, ensuring you get the most value from your
                  CS2 (CS:GO) trades.
                </span>
              </p>
              <h3>
                <span>Fast &amp; dedicated support</span>
              </h3>
              <p>
                <span>
                  Our fast and dedicated support team is always there to assist
                  you with any questions or issues that may arise during your
                  trading experience on our platform.
                </span>
              </p>
              <h3>
                <span>Giveaways</span>
              </h3>
              <p>
                <span>
                  <span>
                    We love to reward our users with regular giveaways, offering
                    you a chance to&nbsp;
                  </span>
                  <a href="https://tradeit.gg/free-cs2-skins">
                    <span>
                      <u>win free CS2 skins</u>
                    </span>
                  </a>
                  <span> and expand your inventory.</span>
                </span>
              </p>
              <h3>
                <span>Swift CS2 (CS:GO) trades</span>
              </h3>
              <p>
                <span>
                  With over 60,000,000 trades completed on Tradeit.gg, our bot
                  trading technology enables swift and secure transactions,
                  allowing you to trade CS2 (CSGO) skins instantly and
                  efficiently. This makes us one of the best CS2 trading bot
                  sites on the web today.
                </span>
              </p>
              <h3>
                <span>Our team are gamers</span>
              </h3>
              <p>
                <span>
                  The team at Tradeit consists of Rust, TF2, and CS2 gamers with
                  thousands of hours spent in-game, and we believe that shines
                  through to our users. We know what you want because we are
                  users as well!
                </span>
              </p>
              <h2>
                <span>Importance of a Fair Trade System in Counter-Strike</span>
              </h2>
              <p>
                <span>
                  A fair trade system is essential for maintaining trust and
                  satisfaction among users on skin trading sites. Tradeit
                  utilizes real Steam market analysis to ensure accurate
                  pricing, and our CS2 (CSGO) trade bots help facilitate fair
                  and secure transactions between users.
                </span>
              </p>
              <h2>
                <span>Tips for Successful Trading in CSGO</span>
              </h2>
              <p>
                <span>
                  Successful trading in CSGO requires understanding key factors
                  such as:
                </span>
              </p>
              <ul>
                <li>
                  <span>Follow market trends.</span>
                </li>
                <li>
                  <span>
                    Understand skin wear levels and the rarity of various skins.
                  </span>
                </li>
                <li>
                  <span>Grasping the importance of the Steam trade URL.</span>
                </li>
                <li>
                  <span>Choose a legitimate CS trading site.</span>
                </li>
              </ul>
              <p>
                <span>
                  Familiarize yourself with these concepts and use
                  Tradeit&apos;s user-friendly interface to optimize your
                  trading experience.
                </span>
              </p>
              <h2>
                <span>How our CS2 (CSGO) Trading Bots Function</span>
              </h2>
              <p>
                <span>
                  Our CSGO (CS2) trading bots work efficiently to execute
                  trades, ensuring a smooth and secure user experience. By
                  employing security measures and fraud prevention techniques,
                  our trade bots in CS2 technology help maintain a safe
                  environment for trading CS:GO skins.
                </span>
              </p>
              <h3>
                <span>Security Measures and Fraud Prevention</span>
              </h3>
              <p>
                <span>
                  Tradeit takes user security seriously. Our CS2 (CS:GO) trading
                  bots employ robust security measures, including the use of the
                  Steam API key and trade offer confirmation processes, to
                  safeguard your Steam account and inventory during
                  transactions.
                </span>
              </p>
              <p>
                <span>
                  Being one of the best (CS2) CSGO bot trading sites, you can
                  relax and trust that we&apos;ve done our part to keep you and
                  your skins safe!
                </span>
              </p>
              <h3>
                <span>Trade Offer Confirmation Process</span>
              </h3>
              <p>
                <span>
                  When you initiate a trade on our platform, our CS2 (CSGO)
                  trade bot sends a trade offer to your Steam account. To
                  complete the transaction securely, you must confirm this trade
                  offer via your Steam profile.
                </span>
              </p>
              <h2>Steam CS2 “Trade Protected” Items &amp; Reverting Trades</h2>
              <p>
                Steam has introduced a new <strong>CS2 trade protection</strong>{" "}
                system to help reduce scams and fraud. With this update, any{" "}
                <strong>CS2 trade</strong> on Steam can be{" "}
                <strong>recovered</strong> by the sender for up to{" "}
                <strong>7 days</strong>. If someone uses the{" "}
                <strong>Recover</strong> option, the trade is fully{" "}
                <strong>reverted</strong>, and both sides get their original CS2
                skins back, However, using the <strong>Recover</strong> feature
                comes with a serious price,{" "}
                <strong>
                  the user&apos;s Steam account will be locked from trading for
                  30 days
                </strong>
                .
              </p>
              <h3>How Does the Reverse trade Feature Work?</h3>
              <p>
                When a Steam user uses the <strong>Recover</strong> option, it{" "}
                <strong>reverts all CS2 trades made in the past 7 days</strong>,
                not just a single trade. All CS2 items involved are
                automatically returned to their original owners.
              </p>
              <h3>What Does “Trade Protected” Mean?</h3>
              <p>
                Items marked with the <strong>“Trade Protected”</strong> badge
                in Steam’s inventory are CS2 skins still within the 7 day
                protect window. These items can be <strong>recovered</strong> by
                the both sides at any time during that period, which means
                ownership isn’t final until the protection expires.
              </p>
              <p>&nbsp;</p>
              <h2>
                <span>FAQs</span>
              </h2>
              <h3>
                <span>How to trade CS2 (CSGO) skins?</span>
              </h3>
              <p>
                <span>
                  <span>
                    To prepare, create your account with your Steam credentials,
                    have your&nbsp;
                  </span>
                  <a href="https://tradeit.gg/blog/steam-trade-url/">
                    <span>
                      <u>Trade URL</u>
                    </span>
                  </a>
                  <span> ready, and activate&nbsp;</span>
                  <a href="https://tradeit.gg/blog/what-is-steam-guard/">
                    <span>
                      <u>Steam Guard</u>
                    </span>
                  </a>
                  <span>.</span>
                </span>
              </p>
              <p>
                <span>Here&apos;s how to trade in CS2:</span>
              </p>
              <ol>
                <li>
                  <span>
                    <strong>Select your items:</strong> Choose what CS2 items
                    you want to trade from your inventory.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Select wanted items:</strong> Pick CS2 items you
                    desire from our wide selection of over 800k skins.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Review the trade:</strong> Review the skins you give
                    and get skins, and press ‘’Trade’’ to continue.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Receive a trade offer instantly:</strong> Confirm
                    the trade, and your items will be on their way.
                  </span>
                </li>
              </ol>
              <h3>
                <span>Where to trade CS2 (CS:GO) skins?</span>
              </h3>
              <p>
                <span>
                  <span>
                    Tradeit.gg is the best-rated CS2 trading website,&nbsp;
                  </span>
                  <a href="https://www.trustpilot.com/review/tradeit.gg">
                    <span>
                      <u>according to Trustpilot reviews</u>
                    </span>
                  </a>
                  <span>.</span>
                </span>
              </p>
              <h3>
                <span>Why choose Tradeit for CS2 trading?</span>
              </h3>
              <p>
                <span>
                  From a vast skin collection and free giveaways to the best CS2
                  trading bots, we offer a top-notch and reliable trading
                  experience.&nbsp;
                </span>
              </p>
              <p>
                <span>
                  <span>You can also choose to either&nbsp;</span>
                  <a href="https://tradeit.gg/buy-cs2-skins">
                    <span>
                      <u>buy CS2 skins</u>
                    </span>
                  </a>
                  <span> or&nbsp;</span>
                  <a href="https://tradeit.gg/sell-cs2-skins">
                    <span>
                      <u>sell your Counter-Strike skins</u>
                    </span>
                  </a>
                  <span> with us.</span>
                </span>
              </p>
              <h3>
                <span>What is CS2 skin trading?</span>
              </h3>
              <p>
                <span>
                  <span>
                    CS2 skin trades involve e­xchanging virtual in-game
                    items&nbsp;
                  </span>
                  <span>
                    <span>
                      unique­ to&nbsp;
                      <a
                        href="https://www.counter-strike.net/cs2"
                        target="_blank"
                      >
                        <u>
                          <span>Counter-Strike 2</span>
                        </u>
                      </a>
                      . Players{" "}
                    </span>
                    trade skins based on their rarity, visual appeal, and market
                    demand.&nbsp;
                  </span>
                </span>
              </p>
              <p>
                <span>
                  The­se skins change the look of we­apons or characters within
                  the game, the­reby personalizing the gaming experience.
                </span>
              </p>
              <h3>
                <span>How do CS2 trading bots work?</span>
              </h3>
              <p>
                <span>
                  CS2 trading bots are automate­d systems created to stre­amline
                  the process of trading skins. These bots efficiently match
                  offe­rs, verify the legitimacy of skins, and ensure secure and
                  prompt transactions. These bots can rapidly execute­ CSGO
                  trades using algorithms, providing users with a seamle­ss
                  experience.
                </span>
              </p>
              <h3>
                <span>Are CS2 trading sites legal?</span>
              </h3>
              <p>
                <span>
                  <span>
                    Yes, CS2 (previously CSGO) trading sites can be considered
                    le­gal as long as they abide by the&nbsp;
                  </span>
                  <a href="https://store.steampowered.com/subscriber_agreement/">
                    <span>
                      <u>te­rms of service established by Steam</u>
                    </span>
                  </a>
                  <span>
                    {" "}
                    and comply with relevant local and international laws.
                    However, users should exercise caution and utilize
                    re­putable platforms like Tradeit.gg to minimize the risk of
                    falling victim to scams or e­ncountering legal troubles.
                  </span>
                </span>
              </p>
              <h3>
                <span>Can you trade CS2 skins for crypto?</span>
              </h3>
              <p>
                <span>
                  Certain mode­rn trading sites for CS2, such as Tradeit,
                  provide the option to use cryptocurre­ncy for payments or
                  trades. A skin trader can exchange their in-game skins for
                  popular cryptocurrencies, such as Bitcoin or Ethe­reum.
                </span>
              </p>
              <h3>
                <span>How to make a CS2 trade with bots?</span>
              </h3>
              <p>
                <span>
                  Using a 3rd-party platform utilizing bots, just like Tradeit,
                  you can perform your trade quickly and safely while having the
                  platform’s trading bots create trade offers for you.
                </span>
              </p>
              <h3>
                <span>How do I know if a CS2 skin trade is fair?</span>
              </h3>
              <p>
                <span>
                  <span>
                    When de­ciding whether a CS2 skin trade is fair, playe­rs
                    can assess the market value­s of the skins involved. Using
                    a&nbsp;
                  </span>
                  <a href="https://tradeit.gg/cs2-inventory-value">
                    <span>
                      <u>CS2 inventory value calculator</u>
                    </span>
                  </a>
                  <span>
                    {" "}
                    or Tradeit’s auto pricing function will make sure that
                    you’re getting fair prices for your skins.
                  </span>
                </span>
              </p>
              <h3>
                <span>Can I trade CS2 skins for games?</span>
              </h3>
              <p>
                <span>
                  <span>You can turn skins into games by </span>
                  <a href="https://tradeit.gg/sell-cs2-skins">
                    <span>
                      <u>selling CS2 items</u>
                    </span>
                  </a>
                  <span>
                    {" "}
                    on Tradeit or the Steam Community Market. However, on the
                    Steam Market, you can only get Steam games.
                  </span>
                </span>
              </p>
              <h3>
                <span>Why is Tradeit the top choice for CS2 traders?</span>
              </h3>
              <p>
                <span>
                  <span>
                    Tradeit has become the preferred trading website for{" "}
                  </span>
                  <a href="https://tradeit.gg/cs2-skins">
                    <span>
                      <u>Counter-Strike skins</u>
                    </span>
                  </a>
                  <span>
                    {" "}
                    due to its high reviews, extensive history with over
                    60,000,000 trades completed, 24/7 support, and 800,000+
                    skins in stock to provide our 3M users.
                  </span>
                </span>
              </p>
              <h3>
                <span>How to trade CSGO (CS2) skins for Rust skins?</span>
              </h3>
              <p>
                <span>
                  To trade CS2 (CSGO) skins for Rust skins, find a trading
                  platform that supports trade offers for skins for both games,
                  like Tradeit does. List your CS skins, search for Rust skins
                  you desire, and initiate a trade offer that suits both
                  parties.
                </span>
              </p>
              <h3>
                <span>
                  What if I encounter issues during the CS:GO trading process?
                </span>
              </h3>
              <p>
                <span>
                  Contact our support team for assistance if you face any issues
                  during the trading process. At Tradeit, our dedicated support
                  staff is available around the clock to help resolve any
                  concerns promptly.
                </span>
              </p>
              <h3>
                <span>Where to trade CS2 skins?</span>
              </h3>
              <p>
                <span>
                  You can trade CS2 skins directly with your friends, find
                  people willing to trade in various trading groups, and utilize
                  websites that facilitate trades like Tradeit.
                  <br />
                </span>
              </p>
              <p>&nbsp;</p>
              <h2>Information for Former Lootbear Users (app.lootbear)</h2>
              <p>
                The CS2 skin rental application, Lootbear, has been shut down,
                and Tradeit is now supporting the community by providing a new,
                secure home for your in-game skins. Below is a simple guide to
                answer all your questions about this transition.
              </p>
              <h3>1. What happened to Lootbear?</h3>
              <p>
                The Lootbear platform is no longer operating; Tradeit has
                stepped up to support Lootbear users and suppliers and provide
                them with excellent trading services and support, including
                management of Lootbear&apos;s trading bots and their items.
              </p>
              <h3>2. How do I access my Lootbear items?</h3>
              <p>
                We have carefully and securely carried over all your items for
                you. Check out the new &quot;Lootbear&quot; tab available on
                Tradeit, which contains all your skins from Lootbear. There, can
                quickly manage, sell, trade, or withdraw your skin collections.
              </p>
              <h3>3. Can I still rent skins?</h3>
              <p>
                No, the feature of renting skins was a standout with the
                presence of Lootbear and cannot, therefore, be found on Tradeit.
                Our system is fully aimed at making the perfect place for
                traders to buy, sell, and exchange skins available.
              </p>
              <h3>4. What if my account balance or items are missing?</h3>
              <p>
                Your current Lootbear account balance does not automatically
                convert. In case your balance or any items possessed by the bots
                are not visible, please get in touch with our 24/7 live support,
                and our team of specialists will be glad to help you.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
