import Image, { StaticImageData } from "next/image"

interface TeamMemberProps {
  name: string
  role: string
  image: string | StaticImageData
}

export function TeamCard({ name, role, image }: TeamMemberProps) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className="rounded-lg mb-2"
      />
      <h3 className="font-semibold text-lg text-[#0A2342]">{name}</h3>
      <p className="text-sm text-[#4A5568]">{role}</p>
    </div>
  )
}

