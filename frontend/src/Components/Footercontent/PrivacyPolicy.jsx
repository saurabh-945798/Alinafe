import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div
      className="bg-[#ECFEFF] pt-24"
      style={{
        fontFamily: 'Bahnschrift, "Segoe UI", Tahoma, Arial, sans-serif',
        fontSize: "18px",
      }}
    >
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-white via-[#ECFEFF] to-[#E6FFFA] py-20 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#14B8A6]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2DD4BF]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-[#0F766E] mb-6"
          >
            Privacy Policy of Use & Membership Agreement
          </motion.h1>

          <div className="max-w-4xl space-y-5 text-gray-700 text-lg leading-relaxed">
            <p>
              The following sets forth Terms and Conditions of{" "}
              <strong>ALINAFE India</strong> regarding usage of all services
              provided by us (the "Service") through the website{" "}
              <strong>ALINAFE.in</strong> and the User Membership Agreement for
              the placement and accessing of products, services, and adverts on
              ALINAFE.in.
            </p>

            <p>
              Those who use the Service (the "Users") shall understand, agree
              to, and comply with each of the provisions of the Terms and
              Conditions set herein.
            </p>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 mt-12 space-y-6">
          {/* ARTICLE 1 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 1: Scope of these Policy of Use
            </h2>
            <p className="text-gray-700">
              1. All of terms of use, set rules and all forms of agreements
              provided by ALINAFE India regarding the Service are deemed to be
              applied as one unit with these Terms and Conditions of Use and
              Membership Agreement. In any case, if the contents of these Terms
              and Conditions of Use differ from the contents of other terms of
              use, special agreements, or rules, the provisions of these Terms
              and Conditions of Use will supersede. Unless particularly stated
              otherwise, terms defined in these Terms and Conditions have the
              same meaning in the terms of use, special agreements, and rules
              etc.
            </p>
            <p className="text-gray-700">
              2. Even if the User uses our Service through any other means,
              these Terms and Conditions will be deemed to be applied between
              the User and ALINAFE India.
            </p>
            <p className="text-gray-700">
              3. ALINAFE India may change the contents of the Terms and
              Conditions of Use and Membership Agreement with time according to
              the amendments of the website, application and digital marketing
              policy. In this case, the changed contents shall be displayed on
              the website and application. Subsequently the User will be bound
              by the changed Terms and Conditions at the earlier of the point
              when a User uses the Service for the first time or the point when
              the notification period provided by us has passed.
            </p>

            <p className="text-gray-700">
              4. For convenience sake, the methods of payment are listed on
              ALINAFE.in. The application or website will take you to the point
              of making payment as you are adding your products or services or
              adverts.
            </p>
          </div>

          {/* ARTICLE 2 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 2: Provision of the Service
            </h2>
            <p className="text-gray-700">
              1. ALINAFE India provides the Service to Users through the
              website, application, or through other methods in order to provide
              highest quality, professional and innovative India business
              solutions to Indian- and international traders and consumers.
            </p>
            <p className="text-gray-700">
              2. The types, contents, and details of the service are as provided
              and posted on ALINAFE.in by ALINAFE India.
            </p>

            <p className="text-gray-700">
              3. ALINAFE India shall post the environment necessary or
              recommended in order to use the Service on the Site. Users shall
              maintain this usage environment at their own expense and
              responsibility.{" "}
            </p>
          </div>

          {/* ARTICLE 3 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 3: Consideration for the Service{" "}
            </h2>
            <p className="text-gray-700">
              1. The Service will attract charges in the following forms:
              insertion or listing fees, commissions, advertisement fees and
              fulfilment (handling) fees.{" "}
            </p>
            <p className="text-gray-700">
              2. Insertion or listing fees are mandatory or compulsory to all
              users who place their products and services on ALINAFE.in.{" "}
            </p>

            <p className="text-gray-700">
              3. ALINAFE India shall post the environment necessary or
              recommended in order to use the Service on the Site. Users shall
              maintain this usage environment at their own expense and
              responsibility.{" "}
            </p>

            <p className="text-gray-700">
              4. For convenience sake, the methods of payment are listed on
              ALINAFE.in. The application or website will take you to the point
              of making payment as you are adding your products or services or
              adverts.
            </p>
          </div>

          {/* ARTICLE 4 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 4: User Registration and Authentication
            </h2>
            <p className="text-gray-700">
              1. In order to enjoy the service, Users are required to register
              as prescribed by ALINAFE.in Users shall complete User
              registration in accordance with the prescribed procedures.
            </p>
            <p className="text-gray-700">
              2. Users shall confirm and warrant to ALINAFE that all of the
              information they provide, as a true statement, accurate, and
              up-to-date. Further, if a change occurs after User registration
              the User shall promptly change their registration in accordance
              with the prescribed procedures.
            </p>

            <p className="text-gray-700">
              3. ALINAFE India may refuse an application for User registration
              at its discretion. In such case, the User may not make any claim
              or objection and ALINAFE India does not have any obligations, such
              as to explain the reason for refusal.
            </p>

            <p className="text-gray-700">
              4. ALINAFE India shall give registered Users (“Registered Users”)
              an ID, password, and other authentication key (“Authentication
              Key”), or if the Authentication Key is set by the Registered User
              itself, the Registered User shall strictly manage the
              Authentication Key and shall not disclose, divulge, or allow
              another person to use the Authentication Key.
            </p>

            <p className="text-gray-700">
              5. ALINAFE India may treat all communications conducted correctly
              using the Registered User’s Authentication Key as being deemed to
              have been conducted by the Registered User itself or by a person
              given the appropriate authority by the Registered User. In such
              case, ALINAFE India is not liable for any damage that occurs to
              the Registered User, even if it occurs due to misuse of the
              Authentication Key or due to another reason.
            </p>

            <p className="text-gray-700">
              6. Registered Users may cancel their User registration in
              accordance with ALINAFE India’s prescribed procedures at any time.
            </p>

            <p className="text-gray-700">
              7. Registered Users are deemed to consent to the receipt of e-mail
              from ALINAFE.in. Registered User can refuse to receive ALINAFE
              Mail by cancelling User Registration or another method provided by
              ALINAFE.in.
            </p>
          </div>

          {/* ARTICLE 5 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 5: Contact Information
            </h2>
            <p className="text-gray-700">
              <p className="text-gray-700">
                1. If ALINAFE India judges that notice is required to be made to
                a Registered User, it will make the notice to the registered
                address using electronic mail, postal mail, telephone, fax, or
                another appropriate method. In this case the notice will be
                deemed to have arrived when it would normally have arrived, even
                if it does not arrive or arrives late.
              </p>
            </p>

            <p className="text-gray-700">
              2. Questions and enquiries about the Service should be directed to
              ALINAFE India by electronic mail or postal mail or visiting
              ALINAFE office, or any other method.
            </p>
          </div>

          {/* ARTICLE 6 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 6: Handling User Information
            </h2>
            <p className="text-gray-700">
              ALINAFE handles personal information in accordance with applicable
              privacy laws and its Privacy Policy.
            </p>

            <p className="text-gray-700">
              2. In addition to Article 6.1, if ALINAFE handles a User’s
              business secrets it shall handle them with the due care of a good
              manager in accordance with the spirit of the Service.
            </p>
          </div>

          {/* ARTICLE 7 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 7: Intellectual Property Rights
            </h2>
            <p className="text-gray-700">
              1. ALINAFE (written in local language Hindi or English) is a
              registered trademark in India.
            </p>

            <p className="text-gray-700">
              2. The copyrights, image rights, or other rights for all written
              materials, photographs, video, and other content posted on the
              Site or in ALINAFE Mail (“ALINAFE Web Content”) belong to ALINAFE
              or an approved third party. Unless otherwise stated by ALINAFE
              India, Users are only permitted to peruse these contents in the
              methods prescribed by ALINAFE and copying, redistributing, or
              using the contents in any other way, or changing, or creating
              derivative works using the contents is prohibited.
            </p>

            <p className="text-gray-700">
              3. Copyrights for messages or files etc. contributed to the Site
              by Users (“Messages”) are transferred to and belong to ALINAFE as
              a result of the contribution. Further, the User shall not exercise
              an author’s personal rights regarding the use. Further, by
              contributing Messages to the Site, Users represent and warrant
              that they have all the rights required to use the Messages and to
              license ALINAFE to use them (including copyright for the Messages,
              and the consent of any individuals that could be identified from
              inclusion in the subject or model for the Messages, or from the
              information in the Messages).
            </p>
          </div>

          {/* ARTICLE 8 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 8: Transactions & Communications
            </h2>
            <p className="text-gray-700">
              1. If Users conduct transactions through the Service, ALINAFE will
              not make any warranties, endorse, act as an agent, mediate,
              intercede, or conduct any canvassing regarding the transaction
              between the Users.
            </p>

            <p className="text-gray-700">
              2. If a User contacts a specified or unspecified Other Operator
              through the service and exchanges Messages or otherwise
              communicates with them, the User shall make judgments regarding
              whether or not to disclose information about the User themselves
              or the User’s assets etc. to the other party, or whether files
              provided by the other party contain harmful programs etc., at
              their own liability.
            </p>

            <p className="text-gray-700">
              3. Any disputes between the Users regarding transactions,
              communication etc. will be resolved at the expense and liability
              of the User.
            </p>

            <p className="text-gray-700">
              4. The User acknowledges and agrees that ALINAFE, within the
              limitation of applicable law, monitors the Users’ communications
              for the purpose of ensuring Use’s compliance with its obligations
              under the Terms and Conditions, and that ALINAFE may restrict,
              delete, or prohibit such communications, if ALINAFE decides it is
              necessary to do so, based on its sole discretion.
            </p>
          </div>

          {/* ARTICLE 9 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 9: Links & Advertisements
            </h2>
            <p className="text-gray-700">
              1. ALINAFE will sometimes posts links from the ALINAFE Web Content
              to other sites. Even in this case ALINAFE will not make any
              warranties, endorse, act as an agent, mediate, intercede, or
              conduct any canvassing, and does not bear any responsibility
              regarding the information and services etc. provided at the linked
              site. Further, whether authorized or not, the same applies for
              sites that link to the Site.
            </p>
            <p className="text-gray-700">
              2. ALINAFE will sometimes posts advertisements on the Site. Even
              in this case ALINAFE will not make any warranties, endorse, act as
              an agent, mediate, intercede, or conduct any canvassing, and does
              not bear any responsibility regarding the products and services
              etc. provided by the advertiser.
            </p>
          </div>

          {/* ARTICLE 10 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 10: ALINAFE's Liability
            </h2>
            <p className="text-gray-700">
              1. ALINAFE may suspend or terminate part or all of the Service
              without prior notice due to system failure, software or hardware
              breakdown, fault, malfunction, or failure of telecommunication
              lines.
            </p>
            <p className="text-gray-700">
              A2. The information provided through the Service and
              communications and other exchanges may be delayed or interrupted
              as a result of ALINAFE.
            </p>
            <p className="text-gray-700">
              3. The information, data, software, products, and services
              provided by ALINAFE through the service may include inaccuracies
              or faults. Further, ALINAFE may add to, change, or delete all or
              part of this information etc. without prior warning.
            </p>
            <p className="text-gray-700">
              4. ALINAFE will take security measures at the level it judges
              reasonable regarding the server and other network equipment
              managed by ALINAFE, but it is possible that incidents such as
              unlawful access, information leakage, or distribution of harmful
              programs could occur, in spite of these measures. Further, as
              ALINAFE does not take security measures regarding information that
              travels over the Internet or other open networks unless
              specifically stated, and since even if security measures are taken
              they could be overridden, it is possible that information could be
              stolen, falsified etc.
            </p>
            <p className="text-gray-700">
              5. ALINAFE does not bear any obligation to protect information
              posted on the site by Users and may arrange, move, or delete the
              information as appropriate.
            </p>
            <p className="text-gray-700">
              6. ALINAFE does not bear any liability regarding damage suffered
              by Users resulting from the events set out in each of the above
              items.
            </p>
            <p className="text-gray-700">
              7. ALINAFE does not bear any liability regarding damage suffered
              by Users resulting from the parts of the service that are provided
              free of charge. Further, even if a User suffers damage resulting
              from ALINAFE’s negligence in a part of the service that is
              provided for a fee, ALINAFE’s liability will be limited to the
              amount of payment actually received regarding the service that was
              the direct cause of the occurrence of damage, whether or not any
              cause for liability exists, such as non-performance of
              obligations, defect warranty, or illegal acts, excluding damage
              arising due to special circumstances and lost profits damage.
            </p>
          </div>

      {/* ARTICLE 11 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    Article 11: Prohibited Acts
  </h2>

  <ol className="ol-decimal pl-6 space-y-3 text-gray-700">
    <li>
      Users shall not conduct any of the actions that fall under the
      following items in their use of the Service:
      
      <ol className="ol-decimal pl-6 mt-3 space-y-2">
        <li>
          breaching the copyrights, trademark rights, or other
          intellectual property rights, privacy rights, image rights, or
          other rights of another person;
        </li>
        <li>
          exposing information or know-how that is kept confidential by
          another person;
        </li>
        <li>
          behaving threateningly, provocatively, or insultingly to
          another party;
        </li>
        <li>
          forcing another person to enter into an association,
          transaction, or service against their will;
        </li>
        <li>
          registering or posting false, misleading, or incorrect
          information;
        </li>
        <li>
          collecting, altering, or deleting another person’s information
          without authorization;
        </li>
        <li>
          impersonation, multiple users per account, or creating
          multiple accounts;
        </li>
        <li>
          unauthorized access, viruses, malicious code, or harmful
          programs;
        </li>
        <li>
          actions that place excessive load on the server;
        </li>
        <li>
          using ALINAFE data outside permitted methods or for commercial
          purposes;
        </li>
        <li>
          posting low-quality, unclear, repetitive, or irrelevant
          content;
        </li>
        <li>
          actions that damage the credibility or reputation of ALINAFE;
        </li>
        <li>
          any other acts violating laws, public order, or ALINAFE rules;
        </li>
        <li>
          ALINAFE is not responsible for damages caused by such acts of
          other users.
        </li>
      </ol>
    </li>
  </ol>
</div>


        {/* ARTICLE 12 */}

          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 12: Termination of Use
            </h2>
            <p className="text-gray-700">
              	ALINAFE may, at its discretion, take any or several of the measures set out below in respect of a particular User without any notice; provided, however, that ALINAFE has no obligation to take such measures:
            </p>
             <p className="text-gray-700">
              1.1 suspension or restriction of all or part of the Service.
            </p>
             <p className="text-gray-700">
              1.2 refusal or restriction of access to the Site;
            </p>
             <p className="text-gray-700">
             1.3 cancellation of User registration and subsequent refusal of User registration;
            </p>
             <p className="text-gray-700">
              1.4 amendment or deletion of all or part of messages submitted by a User;
            </p>
             <p className="text-gray-700">
              1.5 cooperation with criminal or other investigations by investigation agencies and administrative agencies; and  
            </p>
             <p className="text-gray-700">
            1.6 any other measures ALINAFE judges appropriate.
            </p>
          </div>

          {/* ARTICLE 13 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 13: Damages
            </h2>
            <p className="text-gray-700">
             If a User breaches the representations and warranties it made in respect of these Terms and Conditions or if ALINAFE suffers damage due to a User’s willful misconduct or neglect, the User shall compensate ALINAFE for all damage suffered by ALINAFE (including legal fees).
            </p>
          </div>

          {/* ARTICLE 14 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 14: Entire Agreement
            </h2>
            <p className="text-gray-700">
             1.	If part of the provisions of these Terms and Conditions are judged invalid or unenforceable, the provision will be deemed to have been replaced with an effective and enforceable provision, the details of which are as close as possible to the purpose of the original provision. Further, in such case, the other provisions of these Terms and Conditions will survive and will not be influenced in any way.
            </p>
            <p className="text-gray-700">
2.	These Terms and Conditions constitute the entire agreement between the User and ALINAFE regarding the service and the Site and take precedence over all previous or current communications or suggestions made either electronically, in writing, or verbally.            </p>
          </div>

          {/* ARTICLE 15 */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0F766E]">
              Article 15: Governing Law & Jurisdiction
            </h2>
            <p className="text-gray-700">
             1.	The governing law for these Terms and Conditions, the Site, and the Service is the law of India.
            </p>
            <p className="text-gray-700">
2.	The Courts of India has exclusive jurisdiction as a courts of first instance regarding any dispute concerning these Terms and Conditions, the Site, or the Service.            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
