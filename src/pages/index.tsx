import dbConnect from '@/lib/dbConnect';
import { Expense, User } from '@/models';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react'
import Chart, { ChartItem } from 'chart.js/auto';
import { useEffect, useRef } from 'react';

interface HomeProps {
  own_expenses: any;
  expenses: any;
}

export default function Home({ own_expenses, expenses }: HomeProps) {
  const { data: session } = useSession();
  const canvas = useRef<ChartItem>();

  useEffect(() => {
    // const ctx = canvas.current as ChartItem;

    // let chartStatus = Chart.getChart('myChart');
    // if (chartStatus !== undefined) {
    //   chartStatus.destroy();
    // }

    const amount_owed = expenses.reduce((curr: number, prev: any) => {
      console.log(prev.participants);
      const amnt = prev.participants.find((participant: any) => participant.user === session?.user.id)?.share as number;
      return curr + amnt;
    }, 0);

    const amount_people_owe = own_expenses.reduce((curr: number, prev: any) => {
      return curr + prev.amount;
    }, 0);

    console.log(amount_owed, amount_people_owe)

    if (document) {

      var ctx = (document?.getElementById('myChart') as any)?.getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Amount You Owe', 'Amount People Owe you'],
          datasets: [{
            label: 'Expenses',
            data: [amount_owed, amount_people_owe],
            backgroundColor: ['#3B82F6', '#10B981']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Expenses'
            }
          }
        }
      })
    }

    return () => {
      myChart?.destroy();
    }
  }, [])

  return (
    <main
      className='px-8 py-4 flex gap-4 grow items-center'
    >
      <div className='h-full w-full flex items-center'>
        <canvas id='myChart' ref={canvas as any}></canvas>
      </div>
    </main>
  )
}




export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/register',
        permanent: false
      }
    }
  }

  await dbConnect();
  const user = await User.findOne({ email: session?.user?.email });

  if (!user) return {
    redirect: {
      destination: '/auth/register',
      permanent: false
    }
  }

  const own_expenses = await Expense.find({ paidBy: user?._id }).populate('paidBy').populate('participants');

  const expenses = await Expense.find({ participants: { $elemMatch: { user: user._id } } }).populate('paidBy').populate('participants');


  console.log(own_expenses, expenses)

  return {
    props: {
      own_expenses: JSON.parse(JSON.stringify(own_expenses)),
      expenses: JSON.parse(JSON.stringify(expenses))
    }
  }
}