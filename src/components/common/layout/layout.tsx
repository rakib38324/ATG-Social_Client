import React, { ReactNode, useState } from "react";
import Header from "@/components/header/header";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import Footer from "../footer/footer";

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <meta name="description" content="ATG mini social media" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
      </Head>

      <Header />
      <main>
        {children}

        <Toaster />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
