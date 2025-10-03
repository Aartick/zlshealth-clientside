"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

function Page() {
  const router = useRouter()

  return (
    <div className='space-y-4 p-10 text-justify'>
      {/* Title */}
      <div className="pb-2.5 space-y-4">
        <div className="flex items-center justify-between">
          <p className='font-medium text-xl text-[#093C16]'>The Truth About Supplements</p>
          <p className='font-semibold text-[#848484]'>Author | 5 min read | Sep 22, 2025</p>
        </div>
        <p className='text-sm'>
          Many people believe supplements are unsafe,
          addictive, or unnecessary. In this blog,
          we cut through the noise, bust popular myths,
          and show how supplements can safely support your
          everyday health.
        </p>
      </div>

      {/* Introduction */}
      <div className="flex gap-20">
        <div className="flex-1 space-y-4">
          <h2 className='font-medium text-sm'>Introduction</h2>
          <p className='text-xs'>
            Supplements are everywhere - from pharmacy shelves to online
            wellness stores. Yet, despite their popularity, they&apos;re often surrounded by misinformation.
            Some people swear by them as life - changing, while others dismiss them as unnecessary pills.
            The reality lies in the middle: supplements are neither magical quick fixes nor useless add-ons.
            Instead, they are{" "}
            <span className="font-bold text-xs text-[#71BF45]">
              powerful alies in filling nutiritional gaps
            </span>
            , supporting specific health goals, and helping us cope with modern lifestyle challenges.
          </p>

          <p className='text-xs'>
            In this blogs, we&apos;ll separate fact from fiction and tackle the most common myths about
            supplements. By the end, you&apos;ll know exactly how to think about them - and how to make
            smarter choices for your own health.
          </p>
        </div>
        <div className="flex-1 relative w-[636px] h-[262px]">
          <Image
            src="/blogs/1.jpg"
            alt="blog-1"
            fill
            className='rounded-xl'
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-medium text-sm">
          1.Why Supplements Matter
        </h2>

        <p className='text-xs'>
          Even with the best intentions, a perfectly balanced diet is hard to achieve in
          today&apos;s world. Nutrient-rich foods aren&apos;t always accessible,
          and modern farming practices like {" "}
          <span className="font-bold text-[#71BF45]">
            soil depletion
          </span> {" "}
          have reduced the vitamin and mineral content of our fruits and vegetables.
          Add to that {" "}
          <span className="font-bold text-[#71BF45]">
            long supply chains,
          </span> {" "}
          processing cooking methods, and busy lifestyles filled with
          stress and irregular meals - it&apos;s easy to fall short on key nutrients.
        </p>

        <p className='text-justify'>
          This is where supplements step in. They {" "}
          <span className="font-bold text-[#71BF45]">
            don&apos;t replace food
          </span> {" "}
          but rather act as a {" "}
          <span className="font-bold text-[#71BF45]">
            nutritional safety net
          </span> {" "}
          , ensuring your body gets what it needs when your diet
          comes up short. For example,
        </p>

        <ul className='text-xs list-disc ml-3 space-y-1'>
          <li>
            <span className='font-bold'>Vitamin D</span> {" "}
            is essential for bone health and immunity,
            yet deficiency is common in areas with limited sunlight.
          </li>
          <li>
            <span className="font-bold">Omega-3 fatty acids,</span> {" "}
            often lacking in vegetarian diets, are crucial for brain
            and heart health.
          </li>
          <li>
            <span className="font-bold">B vitamins</span> {" "}
            play a key role in energy production and stress management
            but can be easily depleted by a hectic lifestyle.
          </li>
        </ul>

        <p className='text-xs'>
          By strategically adding supplements to your routine,
          you can safeguard your health, your body&apos;s natural
          processes, and bridge the nutritional gaps modern living creates.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className='font-medium text-sm'>2. Clearing the Confusion</h2>
        <div className="flex items-center gap-20">
          <div className='flex-1 space-y-4 text-xs'>
            <p>
              If you&apos;ve ever Googled &quot;Do I need supplements?&quot;, you know how
              overwhelming the answers can be. From influencers making exaggerated
              claims to skeptics warning of dangers, it&apos;s hard to know what to believe.
              This confusion is fueled by three main factors:
            </p>

            <ul className='list-decimal ml-3 space-y-1'>
              <li>
                <span className="font-bold">
                  Marketing Hype:
                </span>{" "}
                Some brands oversell, presenting supplements
                as instant cures.
              </li>
              <li>
                <span className="font-semibold">
                  Lack of Regulation Awareness:
                </span>{" "}
                Consumers worry about safety without understanding
                quality standards like GMP (Good Manufaturing Practices).
              </li>
              <li>
                <span className="font-bold">
                  Generalization:
                </span>{" "}
                Not all supplements are created equal - a
                multivitamin isn&apos;t the same as a specialized
                nutraceutical formula.
              </li>
            </ul>

            <p>
              The key is education and trust. Quality supplements are
              carefully formulated, tested for purity, and designed to
              work with your body, not against it. When sourced from reputable
              brands, supplements can be a safe and valuable part of your lifestyle.
            </p>
          </div>

          <div className='flex justify-end'>
            <Image
              src="/blogs/2.jpg"
              alt='blog-2'
              width={323}
              height={240}
              className='rounded-[20px] object-contain'
            />
          </div>
        </div>
      </div>

      <p className="
          border-l-3 border-[#71BF45] 
          p-5 font-bold italic 
          text-sm text-[#848484] tracking-tight
        "
      >
        From &apos;supplements are just placebos&apos; to &apos;they
        replace a balanced diet,&apos; there are countless myths
        surrounding food supplements. These misconceptions often
        prevent people from experiencing their real benefits. Let&apos;s
        clear the confusion and uncover the truth.
      </p>

      {/* Myths VS Truths */}
      <div className="flex gap-20">
        <div className="space-y-3">
          <h5 className='text-sm font-medium'>Myths vs Truths</h5>

          {/* Myth 1 */}
          <div className="border-2 border-[#D9D9D9] rounded-[20px] py-[5px] px-5">
            <p className='text-xs leading-8'>
              <span className="text-sm font-semibold">Myth 1:</span>{" "}
              Supplements are unnecessary if you eat health.
            </p>
            <p className='text-xs leading-8'>
              <span className="text-sm font-semibold">Truth:</span>{" "}
              Even with a balanced diet, gaps often remain due to soil
              depletion, lifestyle stress, and modern processed foods.
              Supplements help fill those gaps.
            </p>
          </div>

          {/* Myth 2 */}
          <div className="border-2 border-[#D9D9D9] rounded-[20px] py-[5px] px-5">
            <p className='text-xs leading-8'>
              <span className="text-sm font-semibold">Myth 2:</span>{" "}
              Supplements are unsafe or full of chemicals
            </p>
            <p className='text-xs leading-8'>
              <span className="text-sm font-semibold">Truth:</span>{" "}
              Reputable supplements undergo rigorous testing and often use
              natural, plant-based extracts. At Zealous Health, all formulations
              are GMP-certified and free from artificial additives.
            </p>
          </div>

          {/* Myth 3 */}
          <div className="border-2 border-[#D9D9D9] rounded-[20px] py-[5px] px-5">
            <p className='text-xs leading-8'>
              <span className="text-sm font-semibold">Myth 3:</span>{" "}
              Supplements work instantly
            </p>
            <p className='text-xs leading-8'>
              <span className="text-sm font-semibold">Truth:</span>{" "}
              Supplements work gradually to restore balance in your body.
              Like exercise or health eating, results come with consistent
              use over time.
            </p>
          </div>
        </div>
        <div className="pt-[30px] space-y-3">
          <p className="py-5 px-2.5 rounded-[20px] border-3 border-[#D9D9D9]
          text-sm underline decoration-solid decoration-[#71BF45]
          ">
            Supplements don&apos;t replace food - they complement it.
          </p>

          <div className="relative w-full h-[238px]">
            <Image
              src="/blogs/3.jpg"
              fill
              alt='blog-3'
              className='rounded-[20px]'
            />
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="space-y-5">
        <p className="font-medium text-sm">Conclusion</p>

        <div className="flex gap-20">
          {/* IMAGE */}
          <div className="flex-1 relative w-[636px] h-[277px]">
            <Image
              src="/blogs/4.jpg"
              fill
              alt="4-img"
              className='rounded-[20px]'
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex-1 space-y-[30px]">
            <p className="text-xs">
              Supplements are not a miracle, nor are they a scam - they&apos;re{" "}
              <span className='text-[#71BF45] font-bold'>tools for better health.</span>{" "}
              When chosen wisely and paired with a balanced diet and health lifestyle, they
              can make a meaningful difference in energy, immunity, and overall well-being.
            </p>

            <p className="text-xs">
              The bottom line? Don&apos;t fall for myths, don&apos;t
              expect shortcuts, and don&apos;t ignore the potential benefits.
              Instead, make informed choices, consult professionals if needed,
              and use supplements the way they&apos;re meant to be used: as partners
              in your health journey.
            </p>

            <p className="italic font-medium text-sm">
              Ready to take charge of your health with
              science-backed solutions?
            </p>

            <button
              onClick={() => router.push("/products")}
              className="py-2.5 px-5 rounded-[10px] bg-[#093C16]
                         text-white cursor-pointer"
            >
              Explore Our Products
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page