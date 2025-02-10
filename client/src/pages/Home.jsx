import { ArrowRight, Play, QrCode } from "lucide-react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

export default function Home() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-[#1a1b26] text-white px-4 sm:px-8 md:px-12 lg:px-20">
      {/* Hero Section */}
      <div className="mx-auto py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sm:mb-12">
          <h1 className="text-[#c2fd4c] text-lg sm:text-xl font-bold">
            EVENT<span className="text-white">X</span>
          </h1>
          <QrCode className="text-[#c2fd4c] w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="space-y-12 sm:space-y-16 md:space-y-20">
          {/* Main Heading */}
          <div className="max-w-3xl w-full">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl w-full font-bold leading-tight mb-6 sm:mb-8">
              BOOK{" "}
              <span className="inline-block bg-[#6c5dd3] p-2 rounded-lg mx-2">
                <Play className="w-6 h-6 sm:w-8 sm:h-8" />
              </span>{" "}
              AND EXPLORE
              <br />
              UPCOMING <span className="text-[#c2fd4c]">EVENTS</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link
                to={user ? "/events/create" : "/login"}
                className="bg-[#c2fd4c] text-black px-6 sm:px-8 py-3 rounded-full font-semibold flex items-center gap-2 w-fit"
              >
                {user ? "Book Your Seat for EVENTX" : "Browse as Guest"}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/events"
                className="bg-[#6c5dd3] px-3 py-3 rounded-full font-semibold flex items-center gap-2 w-fit"
              >
                {user ? "GET TICKET" : "Browse Events"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-[#1f2937] p-6 rounded-xl">
              <div className="bg-[#6c5dd3] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-400">Get instant notifications about event changes and updates.</p>
            </div>

            <div className="bg-[#1f2937] p-6 rounded-xl">
              <div className="bg-[#6c5dd3] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-400">Safe and secure payment processing for all transactions.</p>
            </div>

            <div className="bg-[#1f2937] p-6 rounded-xl sm:col-span-2 lg:col-span-1">
              <div className="bg-[#6c5dd3] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Social Integration</h3>
              <p className="text-gray-400">Connect with other attendees and share your experiences.</p>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-800 pt-8 gap-6 sm:gap-0">
            <div>
              <h4 className="font-bold mb-2 text-lg sm:text-xl">
                SUBSCRIBE TO
                <br />
                OUR NEWSLETTER
              </h4>
              <button className="bg-[#c2fd4c] text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                Enter Your Email
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="text-left sm:text-right">
              <h5 className="text-[#c2fd4c] text-lg sm:text-xl font-bold mb-4">
                EVENT<span className="text-white">X</span>
              </h5>
              <div className="space-y-2 text-gray-400">
                <p>HOME</p>
                <p>EVENTS</p>
                <p>SCHEDULE</p>
                <p>VENUE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

