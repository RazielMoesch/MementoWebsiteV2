import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Welcome to Memento</h1>

      <div className="homepage-section">
        <h3>About Memento</h3>
        <p>
          At Memento, we are dedicated to empowering individuals living with early-stage Alzheimer’s disease and other forms of dementia to maintain their independence, confidence, and connections with the people who matter most. Our innovative face ID glasses are designed with cutting-edge technology to support memory and facial recognition, helping to rekindle the neural pathways associated with remembering loved ones, friends, and familiar faces. We understand how challenging it can be when memory begins to fade, and our mission is to provide a compassionate, user-friendly solution that enhances quality of life for both those experiencing dementia and their caregivers.
          <br /><br />
          Founded by a team of neuroscientists, technologists, and caregivers, Memento combines advanced artificial intelligence with a deep understanding of the emotional and cognitive needs of individuals with Alzheimer’s. Our face ID glasses are more than just a device—they are a bridge to cherished memories, helping users navigate daily interactions with greater ease and comfort. By offering real-time assistance in recognizing faces and providing gentle, discreet prompts, Memento aims to reduce the stress and confusion that can come with memory loss, fostering moments of connection and joy.
          <br /><br />
          We believe that everyone deserves to live with dignity and maintain meaningful relationships, regardless of the challenges posed by dementia. Memento is here to support you every step of the way, offering a tool that is easy to use, comfortable to wear, and designed with your needs in mind. Our commitment is to create a world where memory loss doesn’t mean losing touch with the people and moments that define who you are.
        </p>
      </div>

      <div className="homepage-section">
        <h3>Our Goals</h3>
        <p>
          Our primary goal at Memento is to make daily life simpler, more fulfilling, and less overwhelming for individuals in the early stages of Alzheimer’s disease or dementia. We have developed our face ID glasses to assist with one of the most common challenges faced by those with early dementia: recognizing familiar faces. This difficulty can lead to feelings of embarrassment, isolation, or frustration, but Memento’s innovative technology is here to help. By using advanced facial recognition algorithms, our glasses identify people in real-time and provide discreet audio or visual cues—such as a name whispered through a bone-conduction earpiece or displayed on the lens—helping to spark memories and strengthen neural connections associated with recognition.
          <br /><br />
          We aim to empower our users to engage confidently in social situations, whether it’s a family gathering, a visit with friends, or an encounter with a neighbor. Our glasses are designed to be intuitive and non-intrusive, blending seamlessly into your daily routine. They are lightweight, stylish, and equipped with features like GPS tracking for safety and the ability to store a database of familiar faces, which can be updated by caregivers or family members. By providing these tools, we strive to reduce the cognitive load on users, allowing them to focus on enjoying the moment rather than struggling to recall names or relationships.
          <br /><br />
          Beyond supporting memory, our goal is to promote independence and emotional well-being. Alzheimer’s can feel overwhelming, but early intervention with tools like Memento’s face ID glasses can make a meaningful difference. Research suggests that stimulating neural pathways through repeated, supported recognition tasks may help slow cognitive decline, and our product is designed with this in mind. We also aim to lighten the burden on caregivers by giving their loved ones a tool that fosters autonomy and reduces the need for constant assistance. At Memento, we are committed to ongoing innovation, working closely with medical professionals and dementia advocates to refine our technology and ensure it meets the evolving needs of our users.
          <br /><br />
          Ultimately, Memento is about more than just technology—it’s about preserving the human connections that make life meaningful. We want to help you hold onto the memories, faces, and relationships that matter most, for as long as possible. With Memento, we’re here to support you in creating lasting moments of recognition, connection, and love.
        </p>
      </div>
    </div>
  );
};

export default HomePage;