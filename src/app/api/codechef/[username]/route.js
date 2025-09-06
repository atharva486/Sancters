import { NextResponse } from "next/server";
import { load } from "cheerio";

export async function GET(request, { params }) {
  const { username } = params;
  const res = await fetch(`https://www.codechef.com/users/${username}`);
  const html = await res.text();

  let totalSolved = 0;
  const match = html.match(/Fully\s+Solved\s*\((\d+)\)/i);
  if (match) {
    totalSolved = parseInt(match[1], 10);
  }

  const $ = load(html);
  const rating = $(".rating-number").text().trim();
  let highestRating = $(".rating-header small").last().text().replace(/[^\d]/g, '').trim();

  return NextResponse.json({
    rating,
    highestRating,
    totalSolved: Number(totalSolved),
  });
}