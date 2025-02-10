import { ArrowRight, Play, QrCode } from "lucide-react"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1b26] text-white px-20">
      {/* Hero Section */}
      <div className=" mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-[#c2fd4c] text-xl font-bold">
            EVENT<span className="text-white">X</span>
          </h1>
          <QrCode className="text-[#c2fd4c] w-8 h-8" />
        </div>

        <div className="space-y-20">
          {/* Main Heading */}
          <div className="max-w-3xl w-full">
            <div className="text-7xl w-full font-bold leading-tight mb-8">
              BOOK{" "}
              <span className="inline-block bg-[#6c5dd3] p-2 rounded-lg mx-2">
                <Play className="w-8 h-8" />
              </span>{" "}
              AND EXPLORE
              <br />
              UPCOMING <span className="text-[#c2fd4c]">EVENTS</span>
            </div>

            {/* Timer */}
            <div className="flex gap-8 mb-8">
              <div className="text-center">
                <span className="text-4xl font-bold">23</span>
                <p className="text-gray-400">HOURS</p>
              </div>
              <div className="text-center">
                <span className="text-4xl font-bold">04</span>
                <p className="text-gray-400">MINUTES</p>
              </div>
              <div className="text-center">
                <span className="text-4xl font-bold">47</span>
                <p className="text-gray-400">SECONDS</p>
              </div>
            </div>

            <Link 
              to="/events"
              className="bg-[#c2fd4c] text-black px-8 py-3 rounded-full font-semibold flex items-center gap-2 w-fit"
            >
              Book Your Seat for EVENTX
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Decide to Join Section */}
          <div className="flex gap-0 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-4">
                DECIDE TO JOIN
                <br />
                THE EVENT
              </h3>
              <p className="text-gray-400 mb-6 w-1/2">
                Once you've found an event you're interested in, you can view all the details and information you need,
                including the event date, time, location, lineup, speakers and agenda.
              </p>
              <Link 
                to="/events"
                className="bg-[#6c5dd3] px-6 py-3 rounded-full font-semibold flex items-center gap-2"
              >
                GET TICKET
                <ArrowRight className="w-10 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -rotate-12 bg-[#c2fd4c] text-black p-16 rounded-lg">
                <span className="text-2xl font-bold">TICKET</span>
              </div>
            </div>
          </div>

          {/* Discover Events Section */}
          <div>
            <h3 className="text-4xl font-bold mb-12">DISCOVER UPCOMING EVENTS</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#6c5dd3] p-8 rounded-xl">
                <h4 className="text-xl font-bold mb-4">EXPLORE THE LOCATION</h4>
                <p className="text-gray-200 mb-6">
                  Our platform is designed to make it easy for you to find and book events that match your interests and
                  preferences.
                </p>
                <Link 
                  to="/events"
                  className="bg-[#c2fd4c] text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2"
                >
                  EXPLORE THE LOCATION
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/original-498ac15ff59efcd693c1833f5e69ccf6.jpg-aM8MnJAcfd2ecDIUDqkVDov2TA4JlG.png"
                  alt="Event venue"
                  className="rounded-xl w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Get Ticket Section */}
          <div className="text-center py-16">
            <h3 className="text-4xl font-bold mb-8">
              GET YOUR
              <br />
              FIRST TICKET
            </h3>
            <Link 
              to="/events"
              className="bg-[#6c5dd3] px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2"
            >
              GET TICKET
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Newsletter Section */}
          <div className="flex justify-between items-center border-t border-gray-800 pt-8">
            <div>
              <h4 className="font-bold mb-2">
                SUBSCRIBE TO
                <br />
                OUR NEWSLETTER
              </h4>
              <button className="bg-[#c2fd4c] text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                Enter Your Email
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="text-right">
              <h5 className="text-[#c2fd4c] text-xl font-bold mb-4">
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

