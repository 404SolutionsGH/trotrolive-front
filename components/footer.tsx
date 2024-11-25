import { Link } from 'lucide-react'
import { Phone } from "lucide-react"

const footer = () => {
  return (
    <footer className="bg-white py-12 border-t">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Our Mission</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Pick a ride</li>
              <li>Find missing item</li>
              <li>Live station</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Home</li>
              <li>Services</li>
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                0245 985 764
              </p>
              <p>info@trotro.ai</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">© 2024 404 Solutions Inc.</div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>English</span>
              <span>Accra</span>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default footer