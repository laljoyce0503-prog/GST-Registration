import { FormInput, FormSelect, FormCheckbox, SectionCard, InfoAlert, Grid2 } from "../../../components/ui/index.jsx";

export default function Tab10_Verification({ data, update, errors, touched, touch }) {
  const f = (name) => ({ value:data[name], error:touched[name]?errors[name]:null, onChange:(e)=>update(name,e.target.value), onBlur:()=>touch(name) });

  // Compute dynamic list of signatories from previous sections
  const signatoryItems = [];

  // 1. Primary Authorized Signatory from Tab 3
  if (data.as_name_first) {
    const fullName = [data.as_name_first, data.as_name_middle, data.as_name_last].filter(Boolean).join(" ");
    signatoryItems.push({
      value: fullName,
      label: `${fullName} [${data.as_pan || ''}]`.toUpperCase().trim()
    });
  }

  // 2. Promoter 1 (if marked as also authorized signatory)
  if (data["Also Authorized Signatory"] && data.name_first) {
    const fullName = [data.name_first, data.name_middle, data.name_last].filter(Boolean).join(" ");
    if (!signatoryItems.some(item => item.value === fullName)) {
      signatoryItems.push({
        value: fullName,
        label: `${fullName} [${data.pan_proprietor || ''}]`.toUpperCase().trim()
      });
    }
  }

  // 3. Promoter 2 (if marked as also authorized signatory)
  if (data["Also Authorized Signatory_2"] && data.name_first_2) {
    const fullName = [data.name_first_2, data.name_middle_2, data.name_last_2].filter(Boolean).join(" ");
    if (!signatoryItems.some(item => item.value === fullName)) {
      signatoryItems.push({
        value: fullName,
        label: `${fullName} [${data.pan_proprietor_2 || ''}]`.toUpperCase().trim()
      });
    }
  }

  return (
    <SectionCard title="Verification & Declaration" icon="✅">
      <FormCheckbox
        label="I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom."
        value={!!data.declaration}
        onChange={(v)=>update("declaration",v)}
        error={touched.declaration?errors.declaration:null}
      />
      <Grid2>
        <FormSelect label="Name of Authorized Signatory" required
          value={data.signatory}
          error={touched.signatory?errors.signatory:null}
          onChange={(e)=>update("signatory",e.target.value)}
          onBlur={()=>touch("signatory")}
          items={signatoryItems}
          placeholder="Select signatory name"
        />
        <FormInput label="Place" required {...f("place")} placeholder="Enter place of signing"/>
        {/* designation_ver — editable */}
        <FormInput label="Designation / Status" {...f("designation_ver")} placeholder="e.g. Proprietor"/>
        {/* date_ver — editable */}
        <FormInput label="Date" type="date" {...f("date_ver")}/>
      </Grid2>
      <InfoAlert type="warning">
        After filling this section, please go to the <strong>Review & Submit</strong> page to review all your details before final submission.
        <br/>Submit button is on the Review & Submit page.
      </InfoAlert>
    </SectionCard>
  );
}
