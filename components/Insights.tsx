"use client";

import { DataType } from "@/actions/load-data";
import { db } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {};

type PieData = {
  name: "Good" | "Average" | "Bad";
  value: number;
};

function Insights({}: Props) {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pie, setPie] = useState<PieData[]>([]);

  const [insights, loadingInsights] = useCollection(
    query(collection(db, "experiment"))
  );

  useEffect(() => {
    if (!loadingInsights && insights) {
      const fetchedData = insights.docs.map((doc) => doc.data()) as DataType[];
      console.log("Fetched Data-->", fetchedData);

      // Sort the data and ensure only numbers are used
      const filtered = fetchedData
        .map((item) => {
          if (typeof item.reactionTime !== "number") {
            item.accuracy = 0;
            item.reactionTime = 1500;
          }
          item.accuracy = Number(item.accuracy);
          item.reactionTime = Number(item.reactionTime);
          return item;
        })
        .sort((a, b) => a.accuracy - b.accuracy);
      console.log("Filtered Data-->", filtered);
      setData(filtered);
      setLoading(false);
    }
  }, [insights, loadingInsights]);

  const pieData = [
    { name: "Good", value: 0 },
    { name: "Average", value: 0 },
    { name: "Bad", value: 0 },
  ];

  const COLORS = ["#0e7490", "#00C49F", "#FFBB28", "#831843"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline='central'>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  console.log(data, insights);

  useEffect(() => {
    const newPieData: PieData[] = [
      { name: "Good", value: 0 },
      { name: "Average", value: 0 },
      { name: "Bad", value: 0 },
    ];

    if (data.length > 0) {
      const newData = [...data];
      newData.forEach((cur) => {
        if (cur.accuracy > 66) {
          newPieData[0].value += 1;
        } else if (cur.accuracy > 33 && cur.accuracy < 66) {
          newPieData[1].value += 1;
        } else {
          newPieData[2].value += 1;
        }
      });
    }

    setPie(newPieData);
  }, [data]);

  const accuracyData = data.slice(-10).map((item) => ({
    accuracy: item.accuracy,
  }));

  const reactionData = data.slice(-10).map((item) => ({
    reaction: item.reactionTime,
  }));

  console.log("PD-->", pie);

  const renderPie = (
    <Card className='w-full h-[400px] p-4'>
      <CardContent className='h-full w-full  flex justify-start items-start flex-col gap-3'>
        <CardTitle>Accuracy Distribution</CardTitle>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart width={400} height={400}>
            <Pie
              dataKey='value'
              isAnimationActive={false}
              data={pie}
              cx='50%'
              cy='50%'
              outerRadius={80}
              fill='#8884d8'
              labelLine={false}
              label={renderCustomizedLabel}>
              {pie.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderLineChart = (
    <Card className='w-full h-[400px] p-4'>
      <CardContent className='h-full w-full  flex justify-start items-start flex-col gap-3'>
        <CardTitle>Accuracy</CardTitle>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart width={600} height={300} data={accuracyData}>
            <Line type='monotone' dataKey='accuracy' stroke='#701a75' />
            <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
            <XAxis />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderResponseChart = (
    <Card className='w-full h-[400px] p-4'>
      <CardContent className='h-full w-full  flex flex-col justify-start items-center gap-3'>
        <CardTitle>Reaction Time</CardTitle>
        <ResponsiveContainer width='100%' height='90%'>
          <LineChart width={600} height={300} data={reactionData}>
            <Line type='monotone' dataKey='reaction' stroke='#065f46' />
            <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
            <XAxis />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  // Average reaction time and accuracy
  const averageReactionTime =
    data.reduce((acc, cur) => {
      return acc + cur.reactionTime;
    }, 0) / data.length;

  const averageAccuracy =
    data.reduce((acc, cur) => {
      return acc + cur.accuracy;
    }, 0) / data.length;
  return (
    <div className='p-4'>
      <Link href='/'>
        <Button>Back To Experiment</Button>
      </Link>

      <h3 className='scroll-m-20 text-4xl font-semibold tracking-tight text-center my-4'>
        Insights
      </h3>
      <div className='grid grid-cols-1 gap-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 max-w-xl'>
          <Card className='max-w-sm'>
            <CardContent className='p-2'>
              <CardTitle>Average Reaction Time</CardTitle>
              <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight text-center my-4'>
                {averageReactionTime.toFixed(2)}ms
              </h3>
            </CardContent>
          </Card>
          <Card className='max-w-sm'>
            <CardContent className='p-2'>
              <CardTitle>Average Accuracy</CardTitle>
              <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight text-center my-4'>
                {averageAccuracy.toFixed(2)}%
              </h3>
            </CardContent>
          </Card>
        </div>
        <div className='grid grid-cols-1  lg:grid-cols-3 gap-4'>
          <div className=''>{renderLineChart}</div>
          <div className=''>{renderResponseChart}</div>
          <div className=''>{renderPie}</div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
