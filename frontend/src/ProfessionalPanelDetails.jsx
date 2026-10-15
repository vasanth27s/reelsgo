import React from "react";

const TOOL_SLUGS = {
  "Monthly recap": "monthly-recap",
  "Best practices": "best-practices",
  "Inspiration": "inspiration",
  "Branded content": "branded-content",
  "Affiliate programmes": "affiliate-programmes",
  "Partnership ads": "partnership-ads",
  "Ad tools": "ad-tools",
  "Trial reels": "trial-reels",
  "Payouts": "payouts",
  "Gifts": "gifts",
  "Trending audio": "trending-audio",
  "Other helpful resources": "helpful-resources",
  "Account status": "account-status",
  "Dashboard settings": "dashboard-settings"
};

function Metric({ value, label }) {
  return <div className="rg-pro-metric"><b>{Number(value || 0).toLocaleString()}</b><small>{label}</small></div>;
}
function Section({ title, children }) {
  return <section className="rg-pro-data-section"><h3>{title}</h3>{children}</section>;
}
function EmptyState({ children }) {
  return <p className="rg-pro-empty-state">{children}</p>;
}
function SaveButton({ onClick, children = "Save changes" }) {
  return <button type="button" className="rg-pro-detail-primary" onClick={onClick}>{children}</button>;
}
function TextSetting({ label, value, onChange, placeholder = "", maxLength = 1000 }) {
  return <label className="rg-pro-field">{label}<textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} rows={3} /></label>;
}
function Toggle({ checked, onChange, children }) {
  return <label className="rg-pro-toggle"><input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} /> <span>{children}</span></label>;
}

export default function ProfessionalPanelDetails({
  panel, analytics, loading, user, toolData, setToolData, saveToolData,
  replies, createSavedReply, deleteSavedReply, savedReplyShortcut, setSavedReplyShortcut,
  savedReplyMessage, setSavedReplyMessage
}) {
  const summary = analytics?.summary || {};
  const daily = analytics?.daily || [];
  const topContent = analytics?.topContent || [];
  const update = (key, value) => setToolData(current => ({ ...current, [key]: value }));
  const save = () => saveToolData(toolData || {});
  const metrics = (
    <div className="rg-pro-detail-stats">
      <Metric value={summary.views} label="Views recorded" />
      <Metric value={summary.reach} label="Accounts reached" />
      <Metric value={summary.impressions} label="Impressions recorded" />
      <Metric value={summary.interactions} label="Interactions" />
      <Metric value={summary.likes} label="Likes" />
      <Metric value={summary.comments} label="Comments" />
    </div>
  );
  const trackedDaily = daily.slice(-14).reverse();

  if (["Views", "Insights"].includes(panel)) {
    return <>
      <p className="rg-pro-panel-intro">Performance from activity recorded by ReelsGo in the last 30 days.</p>
      {metrics}
      <Section title="Daily activity">
        {loading ? <EmptyState>Loading recorded activity…</EmptyState> : trackedDaily.length ? <div className="rg-pro-daily-list">{trackedDaily.map(day =>
          <div key={day._id}><b>{day._id}</b><span>{Number(day.views || 0).toLocaleString()} views</span><span>{Number(day.interactions || 0).toLocaleString()} interactions</span></div>
        )}</div> : <EmptyState>No analytics events have been recorded in this period yet. Views and interactions will appear here after ReelsGo records them.</EmptyState>}
      </Section>
      <Section title="Audience and engagement">
        <div className="rg-pro-detail-stats"><Metric value={summary.followers} label="Current followers" /><Metric value={summary.profileVisits} label="Profile visits recorded" /><Metric value={summary.saves} label="Saves recorded" /></div>
      </Section>
    </>;
  }

  if (panel === "New followers") {
    return <>
      <p className="rg-pro-panel-intro">Follower changes recorded by ReelsGo during the last 30 days. Current follower total comes from your account record.</p>
      <div className="rg-pro-detail-stats"><Metric value={summary.followers} label="Current followers" /><Metric value={summary.newFollowers} label="New follows recorded" /><Metric value={summary.unfollows} label="Unfollows recorded" /><Metric value={summary.netFollowers} label="Net change recorded" /></div>
      <Section title="Recent daily activity">
        {trackedDaily.length ? <div className="rg-pro-daily-list">{trackedDaily.map(day => <div key={day._id}><b>{day._id}</b><span>{Number(day.views || 0).toLocaleString()} views</span><span>{Number(day.interactions || 0).toLocaleString()} interactions</span></div>)}</div> : <EmptyState>No dated analytics events are available yet. This panel does not estimate or invent follower growth.</EmptyState>}
      </Section>
    </>;
  }

  if (panel === "Content you shared") {
    return <>
      <div className="rg-pro-detail-stats"><Metric value={summary.contentShared} label="Total content" /><Metric value={summary.posts} label="Posts" /><Metric value={summary.reels} label="Reels" /></div>
      <Section title="Content performance">
        {topContent.length ? <div className="rg-pro-content-performance">{topContent.map((item, index) =>
          <article key={`${item._id?.contentId || index}-${item._id?.contentType || "content"}`}><div><b>{item._id?.contentType === "reel" ? "Reel" : "Post"} · {String(item._id?.contentId || "").slice(-6)}</b><small>Views recorded: {Number(item.views || 0).toLocaleString()}</small></div><span>{Number(item.likes || 0)} likes · {Number(item.comments || 0)} comments · {Number(item.shares || 0)} shares</span></article>
        )}</div> : <EmptyState>Your content count comes from published database records. Per-post performance will appear here when view and interaction events are recorded.</EmptyState>}
      </Section>
    </>;
  }

  if (panel === "Monthly recap") {
    return <>
      <p className="rg-pro-panel-intro">A recap of recorded activity for the current 30-day dashboard period.</p>
      <div className="rg-pro-detail-stats"><Metric value={summary.contentShared} label="Content shared" /><Metric value={summary.views} label="Views recorded" /><Metric value={summary.interactions} label="Interactions recorded" /><Metric value={summary.netFollowers} label="Net follows recorded" /></div>
      <Section title="Activity summary"><div className="rg-pro-recap-lines">
        <p><b>Posts:</b> {Number(summary.posts || 0).toLocaleString()}</p>
        <p><b>Reels:</b> {Number(summary.reels || 0).toLocaleString()}</p>
        <p><b>Likes / comments / shares / saves:</b> {summary.likes || 0} / {summary.comments || 0} / {summary.shares || 0} / {summary.saves || 0}</p>
      </div></Section>
      {!summary.views && !summary.interactions && <EmptyState>No analytics events have been recorded in this period. Counts above reflect available account records only.</EmptyState>}
    </>;
  }

  if (panel === "Saved replies") {
    return <div className="rg-pro-tool-form">
      <p className="rg-pro-panel-intro">Create reusable replies stored in your ReelsGo account.</p>
      <form onSubmit={createSavedReply}>
        <label className="rg-pro-field">Shortcut<input value={savedReplyShortcut} onChange={e => setSavedReplyShortcut(e.target.value)} placeholder="e.g. thanks" maxLength={40} required /></label>
        <label className="rg-pro-field">Reply message<textarea value={savedReplyMessage} onChange={e => setSavedReplyMessage(e.target.value)} placeholder="Write the reply you want to reuse" maxLength={2000} required rows={4} /></label>
        <button type="submit" className="rg-pro-detail-primary">Save reply</button>
      </form>
      <Section title={`Saved replies (${replies.length})`}>
        {replies.length ? <div className="rg-pro-saved-replies">{replies.map(reply => <article key={reply._id}><b>/{reply.shortcut}</b><p>{reply.message}</p><button type="button" onClick={() => deleteSavedReply(reply._id)}>Delete</button></article>)}</div> : <EmptyState>You have not saved any replies yet.</EmptyState>}
      </Section>
    </div>;
  }

  if (panel === "Best practices") {
    const checks = [
      ["profileComplete", "Keep your name, profile photo and bio current"],
      ["captionChecked", "Review captions and accessibility before publishing"],
      ["privacyChecked", "Review privacy and comment settings"],
      ["weeklyReview", "Review insights before planning the next post"]
    ];
    const checklist = toolData.checklist || {};
    return <>
      <p className="rg-pro-panel-intro">A practical creator checklist. Your completion choices are saved to your ReelsGo tool settings.</p>
      <Section title="Account checklist">{checks.map(([key, label]) => <Toggle key={key} checked={checklist[key]} onChange={value => update("checklist", { ...checklist, [key]: value })}>{label}</Toggle>)}</Section>
      <SaveButton onClick={save}>Save checklist</SaveButton>
    </>;
  }

  if (panel === "Inspiration") {
    const ideas = [
      "Show a short before-and-after process.",
      "Answer one question people commonly ask you.",
      "Share three steps from a skill you use.",
      "Explain the story behind a recent project.",
      "Turn a useful comment into a follow-up post."
    ];
    return <>
      <p className="rg-pro-panel-intro">Content prompts you can adapt to your own topic; these are ideas, not performance predictions.</p>
      <Section title="Ideas to develop"><div className="rg-pro-idea-list">{ideas.map((idea, i) => <article key={idea}><span>{String(i + 1).padStart(2, "0")}</span><p>{idea}</p></article>)}</div></Section>
      <TextSetting label="My next content idea" value={toolData.nextIdea} onChange={value => update("nextIdea", value)} placeholder="Write your own idea or draft…" />
      <SaveButton onClick={save}>Save idea</SaveButton>
    </>;
  }

  if (panel === "Branded content") {
    return <>
      <p className="rg-pro-panel-intro">Record partnership details for your own workflow. This does not publish a paid-partnership label to external platforms.</p>
      <TextSetting label="Brand / partner name" value={toolData.partnerName} onChange={value => update("partnerName", value)} placeholder="Enter a brand or partner" maxLength={160} />
      <TextSetting label="Campaign notes" value={toolData.campaignNotes} onChange={value => update("campaignNotes", value)} placeholder="Deliverables, dates, disclosure notes…" maxLength={4000} />
      <Toggle checked={toolData.disclosureReminder} onChange={value => update("disclosureReminder", value)}>Remind me to check sponsorship disclosure before publishing</Toggle>
      <SaveButton onClick={save} />
    </>;
  }

  if (panel === "Affiliate programmes") {
    return <>
      <p className="rg-pro-panel-intro">Track an affiliate programme manually. No affiliate network is connected, so commissions and links are not imported.</p>
      <TextSetting label="Programme / network" value={toolData.programmeName} onChange={value => update("programmeName", value)} placeholder="Programme name" maxLength={160} />
      <TextSetting label="Affiliate link or application URL" value={toolData.affiliateUrl} onChange={value => update("affiliateUrl", value)} placeholder="https://…" maxLength={1000} />
      <TextSetting label="Notes" value={toolData.notes} onChange={value => update("notes", value)} placeholder="Application status, terms, or next steps" maxLength={4000} />
      <div className="rg-pro-integration-status"><b>Network connection</b><span>Not connected</span><small>Affiliate clicks and commissions cannot be reported until a provider integration is configured.</small></div>
      <SaveButton onClick={save} />
    </>;
  }

  if (panel === "Partnership ads" || panel === "Ad tools") {
    return <>
      <p className="rg-pro-panel-intro">{panel === "Ad tools" ? "Prepare campaign notes and a draft budget." : "Keep partner authorization and campaign notes in one place."} These settings do not launch ads.</p>
      {panel === "Partnership ads" && <TextSetting label="Partner / business account" value={toolData.partnerName} onChange={value => update("partnerName", value)} placeholder="Partner name or account" maxLength={160} />}
      <TextSetting label="Campaign name" value={toolData.campaignName} onChange={value => update("campaignName", value)} placeholder="Campaign draft name" maxLength={160} />
      <TextSetting label="Campaign objective" value={toolData.objective} onChange={value => update("objective", value)} placeholder="e.g. profile visits, product awareness" maxLength={300} />
      <label className="rg-pro-field">Draft budget (optional)<input type="number" min="0" step="0.01" value={toolData.budget ?? ""} onChange={e => update("budget", e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))} placeholder="0.00" /></label>
      <TextSetting label="Campaign notes" value={toolData.notes} onChange={value => update("notes", value)} placeholder="Audience, dates, creative to prepare…" maxLength={4000} />
      <div className="rg-pro-integration-status"><b>Ad delivery</b><span>Not connected</span><small>A configured advertising provider is required to create or run campaigns.</small></div>
      <SaveButton onClick={save} />
    </>;
  }

  if (panel === "Trial reels") {
    return <>
      <p className="rg-pro-panel-intro">Plan a test Reel here. ReelsGo does not currently distribute trial Reels to a separate non-follower audience automatically.</p>
      <TextSetting label="Test Reel concept" value={toolData.concept} onChange={value => update("concept", value)} placeholder="What are you testing?" maxLength={1000} />
      <TextSetting label="Hypothesis / success criteria" value={toolData.successCriteria} onChange={value => update("successCriteria", value)} placeholder="What would make this test useful?" maxLength={1000} />
      <Toggle checked={toolData.readyToPublish} onChange={value => update("readyToPublish", value)}>Mark this test plan ready</Toggle>
      <SaveButton onClick={save} />
    </>;
  }

  if (panel === "Payouts" || panel === "Gifts") {
    return <>
      <p className="rg-pro-panel-intro">{panel === "Payouts" ? "No payout provider is connected, so there are no verified balances, transactions or tax records to display." : "Gift delivery and earnings are not configured in this ReelsGo build. No earnings are estimated."}</p>
      <div className="rg-pro-integration-status"><b>{panel === "Payouts" ? "Payout provider" : "Gifts provider"}</b><span>Not connected</span><small>Connect an eligible provider before showing payment or earning information.</small></div>
      <TextSetting label="Setup notes" value={toolData.notes} onChange={value => update("notes", value)} placeholder="Record setup steps or questions…" maxLength={4000} />
      <SaveButton onClick={save} />
    </>;
  }

  if (panel === "Trending audio") {
    return <>
      <p className="rg-pro-panel-intro">No licensed trending-audio feed is connected. Save audio ideas or reference links manually without implying they are currently trending.</p>
      <TextSetting label="Audio name / reference" value={toolData.audioName} onChange={value => update("audioName", value)} placeholder="Audio title or artist" maxLength={200} />
      <TextSetting label="Reference URL" value={toolData.audioUrl} onChange={value => update("audioUrl", value)} placeholder="https://…" maxLength={1000} />
      <TextSetting label="Notes" value={toolData.notes} onChange={value => update("notes", value)} placeholder="Idea for how to use this audio" maxLength={2000} />
      <SaveButton onClick={save} />
    </>;
  }

  if (panel === "Account status") {
    const checks = [
      ["Profile has a name", !!user?.name],
      ["Username is set", !!user?.username],
      ["Profile has a bio", !!String(user?.bio || "").trim()],
      ["Public account", !user?.isPrivate]
    ];
    return <>
      <p className="rg-pro-panel-intro">These are profile setup checks only. This app does not currently have a moderation enforcement or recommendation-eligibility feed.</p>
      <Section title="Profile setup">{checks.map(([label, ok]) => <div className="rg-pro-status-row" key={label}><span>{label}</span><b className={ok ? "is-ok" : "is-missing"}>{ok ? "Complete" : "Review"}</b></div>)}</Section>
      <EmptyState>For restrictions, reports, or recommendation eligibility, a moderation/status service must provide that data. No account restriction is assumed here.</EmptyState>
    </>;
  }

  if (panel === "Dashboard settings") {
    return <>
      <p className="rg-pro-panel-intro">These preferences are stored with your ReelsGo professional tool settings.</p>
      <label className="rg-pro-field">Dashboard note / goal<textarea value={toolData.dashboardGoal || ""} onChange={e => update("dashboardGoal", e.target.value)} placeholder="What do you want to focus on this month?" maxLength={1000} rows={3} /></label>
      <Toggle checked={toolData.showZeroMetrics !== false} onChange={value => update("showZeroMetrics", value)}>Show metrics even when the recorded value is zero</Toggle>
      <SaveButton onClick={save} />
    </>;
  }

  if (panel === "Other helpful resources") {
    return <>
      <p className="rg-pro-panel-intro">Use these practical resources to review your ReelsGo account.</p>
      <Section title="Account workflow"><div className="rg-pro-resource-list">
        <article><b>Profile setup</b><p>Review your name, username, bio, profile image and public/private setting.</p></article>
        <article><b>Publishing checklist</b><p>Check the media, caption, audience and comment settings before publishing.</p></article>
        <article><b>Performance review</b><p>Use recorded views and interactions to compare content; do not treat missing events as zero audience interest.</p></article>
        <article><b>Account safety</b><p>Keep sign-in details private and review your account security settings regularly.</p></article>
      </div></Section>
      <TextSetting label="Resource notes" value={toolData.notes} onChange={value => update("notes", value)} placeholder="Save useful reminders…" maxLength={3000} />
      <SaveButton onClick={save} />
    </>;
  }

  if (panel === "All tools") {
    return <Section title="Professional tools"><div className="rg-pro-resource-list">
      {Object.keys(TOOL_SLUGS).map(name => <article key={name}><b>{name}</b><p>Open this item from the dashboard to view its available data and settings.</p></article>)}
    </div></Section>;
  }

  return <EmptyState>There is no panel configured for this option yet.</EmptyState>;
}
