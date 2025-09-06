import { NextResponse } from "next/server";
import { load } from "cheerio";

export async function GET(request, { params }) {
  const { username } = params;
  const res = await fetch(`https://www.codechef.com/users/${username}`);
  const html = await res.text();
  const $ = load(html);

  const rating = $(".rating-number").text().trim();
  const highestRating = $(".rating-header small").last().text().replace(/[^\d]/g, '').trim();

  return NextResponse.json({
    rating,
    highestRating,
  });
}
