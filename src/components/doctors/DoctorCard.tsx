import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  IndianRupee,
  Loader2,
  MapPin,
  Star,
  Stethoscope,
} from "lucide-react";
import type { Doctor } from "@/data/doctors";
import { DoctorAvatar } from "./DoctorAvatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DoctorCard({ doctor, index = 0 }: { doctor: Doctor; index?: number }) {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(false);

  const handleBook = () => {
    if (booking) return;
    setBooking(true);
    void navigate({ to: "/book/$doctorId", params: { doctorId: doctor.id } }).finally(() =>
      setBooking(false),
    );
  };

  return (
    <article className="glass-card flex flex-col gap-4 p-5">
      <div className="flex gap-4">
        <DoctorAvatar name={doctor.name} seed={index} className="h-16 w-16 text-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-base font-semibold text-navy">{doctor.name}</h3>
            {doctor.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium text-success">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm font-medium text-primary">{doctor.specialty}</p>
          <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {doctor.experience} years experience
          </p>
        </div>
      </div>

      <div className="grid gap-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="truncate">{doctor.clinic}</span>
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          {doctor.area}, {doctor.city}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-success" aria-hidden="true" />
          <span className="font-medium text-success">Next available: {doctor.nextAvailable}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-navy">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
          {doctor.rating} ({doctor.reviewCount})
        </span>
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-navy">
          <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" />
          {doctor.fee} consultation
        </span>
        <Badge variant="outline" className="rounded-full text-xs font-normal">
          In-clinic
        </Badge>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
        <Button asChild variant="outline" className="h-11 w-full rounded-xl px-2 text-sm">
          <Link to="/doctors/$doctorId" params={{ doctorId: doctor.id }}>
            View Profile
          </Link>
        </Button>
        <Button
          type="button"
          onClick={handleBook}
          disabled={booking}
          aria-busy={booking}
          className="h-11 w-full min-w-0 rounded-xl bg-gradient-to-r from-primary to-navy px-2 text-sm font-semibold shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/35 disabled:translate-y-0 disabled:opacity-70"
        >
          {booking ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
          ) : (
            <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span className="truncate">{booking ? "Opening…" : "Book Appointment"}</span>
        </Button>
      </div>
    </article>
  );
}
